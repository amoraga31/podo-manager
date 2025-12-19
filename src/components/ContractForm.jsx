import React, { useState, useEffect } from 'react'
import { Plus, AlertCircle } from 'lucide-react'

export function ContractForm({ onAdd, lockedSalesperson, salespeople = [] }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        dni: '',
        phone: '',
        address: '',
        iban: '',
        type: 'Solluz',
        cupsCount: '1',
        salesperson: lockedSalesperson || '',
        notes: ''
    })
    const [contractIds, setContractIds] = useState(['']) // Array of ID strings
    const [error, setError] = useState(null)

    // Sync lockedSalesperson
    useEffect(() => {
        if (lockedSalesperson) {
            setFormData(prev => ({ ...prev, salesperson: lockedSalesperson }))
        }
    }, [lockedSalesperson])

    // Sync contractIds array length with cupsCount
    useEffect(() => {
        const count = parseInt(formData.cupsCount) || 0
        setContractIds(prev => {
            const newIds = [...prev]
            if (count > newIds.length) {
                // Add empty slots
                for (let i = newIds.length; i < count; i++) newIds.push('')
            } else if (count < newIds.length) {
                // Trim excess
                newIds.length = count
            }
            return newIds
        })
    }, [formData.cupsCount])

    const handleIdChange = (index, value) => {
        const newIds = [...contractIds]
        newIds[index] = value
        setContractIds(newIds)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null) // Reset error

        // 1. Validation Logic
        const requiredFields = [
            { field: 'clientName', label: 'Nombre Cliente' },
            { field: 'dni', label: 'DNI/NIE' },
            { field: 'phone', label: 'Teléfono' },
            { field: 'address', label: 'Dirección' },
            { field: 'salesperson', label: 'Comercial' }
            // IBAN is often optional or can be validated later, but let's make it required as implied
        ]

        // Check required simplified fields
        const missing = requiredFields.filter(f => !formData[f.field]?.trim())
        if (!formData.iban?.trim()) missing.push({ field: 'iban', label: 'IBAN' })

        // Check CUPS Count > 0
        if (parseInt(formData.cupsCount) < 1) {
            setError('⚠️ Error: Debe haber al menos 1 CUPS.')
            return
        }

        // Check if all IDs are filled
        const emptyIds = contractIds.some(id => !id.trim())
        if (emptyIds) {
            setError(`⚠️ Falta CUPS: Has indicado ${formData.cupsCount} CUPS, así que debes rellenar los ${formData.cupsCount} códigos CUPS.`)
            return
        }

        if (missing.length > 0) {
            setError(`⚠️ Campos Incompletos: Faltan ${missing.map(m => m.label).join(', ')}`)
            return
        }

        // 2. Submission
        try {
            const cupsCountInt = parseInt(formData.cupsCount) || 1
            await onAdd({
                ...formData,
                cupsCount: cupsCountInt,
                contractIds: contractIds, // Send the array 
                // Force default status to OK
                statusDetails: { 'OK': cupsCountInt }
            })

            // 3. Reset (Only if successful)
            setFormData({
                date: new Date().toISOString().split('T')[0],
                clientName: '',
                dni: '',
                phone: '',
                address: '',
                iban: '',
                type: 'Solluz',
                cupsCount: '1',
                salesperson: lockedSalesperson || '',
                notes: ''
            })
            // contractIds will auto-reset via useEffect because cupsCount resets to '1'
            // Clear any errors
            setError(null)

        } catch (err) {
            console.error("Submission failed:", err)
            setError(`⚠️ Error al guardar: ${err.message || 'Inténtalo de nuevo.'}`)
        }
    }

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>New Contract</h2>

            {error && (
                <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 500
                }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>

                {/* Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Fecha</label>
                    <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="input-field"
                    />
                </div>

                {/* Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Tipo</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                        className="input-field"
                    >
                        <option value="Solluz">Solluz</option>
                        <option value="Podo Energia">Podo Energia</option>
                    </select>
                </div>


                {/* Client Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Nombre Cliente</label>
                    <input
                        type="text"
                        required
                        placeholder="Nombre completo..."
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="input-field"
                    />
                </div>

                {/* DNI */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>DNI/NIE</label>
                    <input
                        type="text"
                        required
                        placeholder="12345678X"
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        className="input-field"
                    />
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Teléfono</label>
                    <input
                        type="text"
                        required
                        placeholder="600000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-field"
                    />
                </div>

                {/* Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Dirección Suministro + CP</label>
                    <input
                        type="text"
                        required
                        placeholder="Calle Ejemplo 1, 28000 Madrid"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="input-field"
                    />
                </div>

                {/* IBAN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>IBAN</label>
                    <input
                        type="text"
                        required
                        placeholder="ES00 0000 0000 0000 0000 0000"
                        value={formData.iban}
                        onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                        className="input-field"
                        style={{ fontFamily: 'monospace' }}
                    />
                </div>



                {/* CUPS Count (Number Input) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Número de CUPS</label>
                    <input
                        type="number"
                        min="1"
                        required
                        value={formData.cupsCount}
                        onChange={(e) => setFormData({ ...formData, cupsCount: e.target.value })}
                        className="input-field"
                    />
                </div>

                {/* Dynamic CUPS Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem', gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem' }}>
                    {contractIds.map((id, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>CUPS {index + 1}</label>
                            <input
                                type="text"
                                required
                                placeholder={`Código CUPS ${index + 1}`}
                                value={id}
                                onChange={(e) => handleIdChange(index, e.target.value)}
                                className="input-field"
                                style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Salesperson & Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Comercial</label>
                    {lockedSalesperson ? (
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem',
                            cursor: 'not-allowed',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            🔒 {lockedSalesperson}
                        </div>
                    ) : (
                        <select
                            value={formData.salesperson}
                            onChange={(e) => setFormData({ ...formData, salesperson: e.target.value })}
                            required
                            disabled={!!lockedSalesperson}
                            className="input-field"
                        >
                            <option value="">Seleccionar...</option>
                            {salespeople.map(person => (
                                <option key={person} value={person}>{person}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Status</label>
                    <div style={{
                        height: '42px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        color: '#10b981',
                        fontWeight: 600,
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        Auto: OK
                    </div>
                </div>

                {/* Notes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Notas (Opcional)</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Detalles adicionales, observaciones, etc."
                        className="input-field"
                        style={{
                            minHeight: '80px',
                            resize: 'vertical',
                            height: 'auto'
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', height: '48px', marginTop: '1rem', fontSize: '1rem' }}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Añadir Contrato
                </button>

            </form>
        </div>
    )
}
