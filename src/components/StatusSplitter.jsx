import React, { useState } from 'react'
import { X, Check } from 'lucide-react'

export function StatusSplitter({ totalCups, currentDetails, onSave, onClose }) {
    const [distribution, setDistribution] = useState(() => {
        if (currentDetails && Object.keys(currentDetails).length > 0) {
            return { ...currentDetails }
        }
        return { 'PENDIENTE': totalCups }
    })

    const statuses = [
        { key: 'OK', label: 'OK', color: '#10b981' },
        { key: 'OK RECUPERADO', label: 'OK RECU.', color: '#059669' },
        { key: 'PENDIENTE', label: 'PENDIENTE', color: '#eab308' },
        { key: 'KO DISTRI', label: 'KO DISTRI', color: '#ef4444' },
        { key: 'KO CALIDAD', label: 'KO CALIDAD', color: '#dc2626' },
        { key: 'ILOC CALIDAD', label: 'ILOC CALI.', color: '#b91c1c' },
        { key: 'BAJA COMER', label: 'BAJA COMER', color: '#7f1d1d' },
    ]

    const handleAmountChange = (status, val) => {
        const newVal = parseInt(val) || 0
        setDistribution(prev => ({ ...prev, [status]: newVal }))
    }

    const currentTotal = Object.values(distribution).reduce((a, b) => a + (parseInt(b) || 0), 0)
    const isValid = currentTotal <= totalCups
    const remaining = totalCups - currentTotal

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="splitter-panel"
            style={{
                position: 'absolute',
                top: '-10px', // Safe elevation: slightly up, but not enough to clip header
                left: 0,
                zIndex: 50,
                minWidth: '280px',
                background: '#18181b', // Solid Opaque
                border: '1px solid #3f3f46',
                borderRadius: '0.75rem',
                padding: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Distribute CUPS</h4>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Total: {totalCups}</span>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: '#a1a1aa',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                >
                    <X size={14} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {statuses.map(({ key, label, color }) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.25rem', borderRadius: '0.25rem', transition: 'background 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }}></div>
                            <span style={{ color: '#d4d4d8', fontWeight: 500 }}>{label}</span>
                        </div>
                        <input
                            type="number"
                            min="0"
                            max={totalCups}
                            value={distribution[key] || ''}
                            placeholder="-"
                            onChange={(e) => handleAmountChange(key, e.target.value)}
                            style={{
                                width: '45px',
                                padding: '0.25rem',
                                borderRadius: '0.25rem',
                                border: distribution[key] > 0 ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                textAlign: 'center',
                                outline: 'none',
                                fontSize: '0.8rem',
                                fontWeight: distribution[key] > 0 ? 600 : 400
                            }}
                        />
                    </div>
                ))}
            </div>

            <div style={{
                fontSize: '0.75rem',
                marginBottom: '1rem',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: remaining !== 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: remaining !== 0 ? '#f87171' : '#34d399',
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 500
            }}>
                {remaining > 0 ? `${remaining} undetermined` : remaining < 0 ? `${Math.abs(remaining)} too many!` : 'All perfectly distributed'}
            </div>

            <button
                disabled={!isValid || remaining < 0}
                onClick={() => onSave(distribution)}
                style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: isValid && remaining >= 0 ? 'linear-gradient(to right, #10b981, #059669)' : '#27272a',
                    color: isValid && remaining >= 0 ? 'white' : '#52525b',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: isValid && remaining >= 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    boxShadow: isValid && remaining >= 0 ? '0 4px 6px -1px rgba(16, 185, 129, 0.3)' : 'none',
                    transition: 'all 0.2s'
                }}
            >
                <Check size={16} /> Save Status
            </button>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                /* Hide scrollbar for cleaner look */
                .splitter-panel ::-webkit-scrollbar {
                    width: 4px;
                }
                .splitter-panel ::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
            `}</style>
        </div >
    )
}
