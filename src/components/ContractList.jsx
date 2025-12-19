import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, Edit2, Save, X } from 'lucide-react'
import { StatusSplitter } from './StatusSplitter'

export function ContractList({ contracts = [], onDelete, onUpdateStatus, onUpdateField, userRole }) {
    const [editingId, setEditingId] = useState(null)
    const [expandedIds, setExpandedIds] = useState(new Set())

    // State for editing notes: { id: "contractId", text: "current draft" }
    const [editingNote, setEditingNote] = useState(null)

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedIds(newExpanded)
    }

    // ... formatStatus helper (same as before) ...
    const formatStatus = (contract) => {
        if (!contract.statusDetails) {
            const s = contract.status || 'PENDIENTE'
            return (
                <span className={`status-badge status-${s.toLowerCase().replace(/\s+/g, '-')}`}>
                    {s}
                </span>
            )
        }
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {Object.entries(contract.statusDetails).map(([status, count]) => {
                    if (count > 0) {
                        return (
                            <span key={status} className={`status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>
                                {count} {status}
                            </span>
                        )
                    }
                    return null
                })}
            </div>
        )
    }

    if (contracts.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No contracts found. Start by adding one above.
            </div>
        )
    }

    const isManager = userRole && userRole.startsWith('GERENTE')

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ width: '40px', padding: '1rem' }}></th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Date</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Client</th>
                            {isManager && (
                                <>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>DNI</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Address</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Phone</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>IBAN</th>
                                </>
                            )}
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Type</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>CUPS</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Salesperson</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, maxWidth: '200px' }}>Notes</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--color-text-muted)', fontWeight: 500 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map((contract) => (
                            <React.Fragment key={contract.id}>
                                <tr style={{ borderBottom: expandedIds.has(contract.id) ? 'none' : '1px solid rgba(255,255,255,0.05)', background: expandedIds.has(contract.id) ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => toggleExpand(contract.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex' }}
                                        >
                                            {expandedIds.has(contract.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{contract.date}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{contract.clientName}</td>
                                    {isManager && (
                                        <>
                                            <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{contract.dni || '-'}</td>
                                            <td style={{ padding: '1rem', color: 'var(--color-text-muted)', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={contract.address}>{contract.address || '-'}</td>
                                            <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{contract.phone || '-'}</td>
                                            <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{contract.iban || '-'}</td>
                                        </>
                                    )}
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`type-badge type-${contract.type.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {contract.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{contract.cupsCount}</td>
                                    <td style={{ padding: '1rem' }}>{contract.salesperson}</td>
                                    <td style={{ padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                        {contract.notes}
                                    </td>
                                    <td style={{ padding: '1rem', position: 'relative', zIndex: editingId === contract.id ? 10 : 'auto' }}>
                                        {/* Status Logic */}
                                        {editingId === contract.id ? (
                                            <StatusSplitter
                                                totalCups={contract.cupsCount}
                                                currentDetails={contract.statusDetails || { [contract.status || 'PENDIENTE']: contract.cupsCount }}
                                                onClose={() => setEditingId(null)}
                                                onSave={(newDetails) => {
                                                    onUpdateStatus(contract.id, newDetails)
                                                    setEditingId(null)
                                                }}
                                            />
                                        ) : (
                                            <select
                                                value={contract.status === 'VARIOS' ? 'DISTRIBUIR' : (contract.status || 'PENDIENTE')}
                                                onChange={(e) => {
                                                    if (e.target.value === 'DISTRIBUIR') {
                                                        setEditingId(contract.id)
                                                    } else {
                                                        onUpdateStatus(contract.id, e.target.value)
                                                    }
                                                }}
                                                style={{
                                                    fontSize: '0.8rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '999px',
                                                    border: 'none',
                                                    backgroundColor: (contract.status || '').includes('OK') ? 'rgba(16, 185, 129, 0.15)' :
                                                        (contract.status || '').includes('KO') || (contract.status || '').includes('BAJA') || (contract.status || '').includes('ILOC') ? 'rgba(239, 68, 68, 0.15)' :
                                                            contract.status === 'VARIOS' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                                                    color: (contract.status || '').includes('OK') ? '#10b981' :
                                                        (contract.status || '').includes('KO') || (contract.status || '').includes('BAJA') || (contract.status || '').includes('ILOC') ? '#ef4444' :
                                                            contract.status === 'VARIOS' ? '#818cf8' : '#eab308',
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                    fontWeight: 500,
                                                    maxWidth: '140px'
                                                }}
                                            >
                                                <option value="OK">OK</option>
                                                <option value="OK RECUPERADO">OK RECUPERADO</option>
                                                <option value="PENDIENTE">PENDIENTE</option>
                                                <option value="BAJA COMER">BAJA COMER</option>
                                                <option value="KO DISTRI">KO DISTRI</option>
                                                <option value="KO CALIDAD">KO CALIDAD</option>
                                                <option value="ILOC CALIDAD">ILOC CALIDAD</option>
                                                <option disabled>──────────</option>
                                                <option value="DISTRIBUIR">📝 DISTRIBUIR...</option>
                                                {contract.statusDetails && <option value="DISTRIBUIR" hidden>VARIOS / DETALLE</option>}
                                            </select>
                                        )}
                                        {contract.statusDetails && !editingId && (
                                            <div style={{ fontSize: '0.7rem', marginTop: '0.25rem', color: '#a1a1aa' }}>
                                                {formatStatus(contract)}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        {onDelete && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDelete(contract.id)
                                                }}
                                                className="icon-button delete-button"
                                                title="Delete contract"
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    padding: '0.25rem',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    float: 'right'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {expandedIds.has(contract.id) && (
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                        <td colSpan="9" style={{ padding: '0 1rem 1rem 1rem' }}>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                gap: '1rem',
                                                fontSize: '0.875rem',
                                                color: 'var(--color-text-muted)',
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '1rem',
                                                borderRadius: '0.5rem'
                                            }}>


                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <div style={{ marginBottom: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>IDs / CUPS</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {contract.contractIds && contract.contractIds.length > 0 ? (
                                                            contract.contractIds.map((id, idx) => (
                                                                <span key={idx} style={{
                                                                    background: 'rgba(255,255,255,0.05)',
                                                                    padding: '0.25rem 0.5rem',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.8rem',
                                                                    fontFamily: 'monospace',
                                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                                }}>
                                                                    {id}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span style={{ fontStyle: 'italic', opacity: 0.5 }}>-</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>Full Notes</span>
                                                        {!editingNote && (
                                                            <button
                                                                onClick={() => setEditingNote({ id: contract.id, text: contract.notes || '' })}
                                                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                                                            >
                                                                <Edit2 size={12} /> Edit
                                                            </button>
                                                        )}
                                                    </div>

                                                    {editingNote && editingNote.id === contract.id ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                            <textarea
                                                                value={editingNote.text}
                                                                onChange={(e) => setEditingNote(prev => ({ ...prev, text: e.target.value }))}
                                                                style={{
                                                                    width: '100%',
                                                                    background: 'var(--color-background)',
                                                                    border: '1px solid var(--color-border)',
                                                                    borderRadius: '0.25rem',
                                                                    padding: '0.5rem',
                                                                    color: 'var(--color-text)',
                                                                    minHeight: '80px',
                                                                    resize: 'vertical'
                                                                }}
                                                            />
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                                <button
                                                                    onClick={() => {
                                                                        onUpdateField(contract.id, 'notes', editingNote.text)
                                                                        setEditingNote(null)
                                                                    }}
                                                                    style={{
                                                                        background: 'var(--color-primary)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '0.25rem',
                                                                        padding: '0.4rem',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    title="Save"
                                                                >
                                                                    <Save size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingNote(null)}
                                                                    style={{
                                                                        background: 'var(--color-surface)',
                                                                        color: 'var(--color-text)',
                                                                        border: '1px solid var(--color-border)',
                                                                        borderRadius: '0.25rem',
                                                                        padding: '0.4rem',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    title="Cancel"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{contract.notes || '-'}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
