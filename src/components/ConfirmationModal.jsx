import React from 'react'

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: '#18181b',
                border: '1px solid var(--color-border)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1)',
                animation: 'scaleIn 0.2s ease-out'
            }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>
                    {title}
                </h3>
                <p style={{ color: '#a1a1aa', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            background: 'transparent',
                            color: '#e4e4e7',
                            border: '1px solid #3f3f46',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.background = '#b91c1c'}
                        onMouseLeave={e => e.target.style.background = '#dc2626'}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    )
}
