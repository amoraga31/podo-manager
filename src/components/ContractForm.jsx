import React, { useState, useEffect } from 'react'
import { Plus, AlertCircle } from 'lucide-react'

export function ContractForm({ onAddContract, lockedSalesperson }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        type: 'Solluz',
        cupsCount: '1', // Changed back to count
        salesperson: lockedSalesperson || '',
        dni: '',
        phone: '',
        address: '',
        iban: '',
        notes: ''
    })
    const [error, setError] = useState(null)

    // Sync lockedSalesperson if it changes (e.g. user logs in)
    useEffect(() => {
        if (lockedSalesperson) {
            setFormData(prev => ({ ...prev, salesperson: lockedSalesperson }))
        }
    }, [lockedSalesperson])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null) // Reset error

        // 1. Validation Logic
        const requiredFields = [
            { field: 'clientName', label: 'Nombre Cliente' },
            { field: 'dni', label: 'DNI / NIE' },
            { field: 'phone', label: 'Teléfono' },
            { field: 'address', label: 'Dirección' },
            { field: 'iban', label: 'IBAN' },
            { field: 'salesperson', label: 'Comercial' }
        ]

        // Check required simplified fields
        const missing = requiredFields.filter(f => !formData[f.field]?.trim())

        // Check CUPS Count > 0
        if (parseInt(formData.cupsCount) < 1) {
            setError('⚠️ Error: Debe haber al menos 1 CUPS.')
            return
        }

        if (missing.length > 0) {
            setError('⚠️ Campos Incompletos: Por favor revisa que todos los datos obligatorios estén rellenos.')
            return
        }

        // 2. Submission
        try {
            await onAddContract({
                ...formData,
                cupsCount: parseInt(formData.cupsCount) || 1
            })

            // 3. Reset (Only if successful)
            setFormData({
                date: new Date().toISOString().split('T')[0],
                clientName: '',
                type: 'Solluz',
                cupsCount: '1',
                salesperson: lockedSalesperson || '',
                dni: '',
                phone: '',
                address: '',
                iban: '',
                notes: ''
            })
            // Clear any errors
            setError(null)

        } catch (err) {
            console.error("Submission failed:", err)
            // Display friendly message for common SQL errors
            if (err.message && err.message.includes('column "phone" of relation "contracts" does not exist')) {
                setError('⚠️ Error Base de Datos: Falta la columna "phone". Por favor avisa al técnico.')
            } else {
                setError(`⚠️ Error al guardar: ${err.message || 'Inténtalo de nuevo.'}`)
            }
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
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

                {/* DNI & Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>DNI / NIE</label>
                    <input
                        type="text"
                        required
                        placeholder="12345678A"
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        className="input-field"
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Teléfono</label>
                    <input
                        type="tel"
                        required
                        placeholder="666777888"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-field"
                    />
                </div>

                {/* Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Dirección Completa</label>
                    <input
                        type="text"
                        required
                        placeholder="Calle, Número, Piso, CP, Ciudad..."
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
                        placeholder="ES00 0000 0000 0000 0000"
                        value={formData.iban}
                        onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                        className="input-field"
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
                            <option value="Amoraga">Amoraga</option>
                            <option value="Dario">Dario</option>
                            <option value="Hamza">Hamza</option>
                            <option value="Jorge">Jorge</option>
                            <option value="Sean">Sean</option>
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
