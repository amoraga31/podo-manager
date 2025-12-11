import React from 'react'

export function Header({ onLogout }) {
    return (
        <header style={{
            padding: '1.5rem 0',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '2rem'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem' }}>Contract Management</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Track Sales & Performance</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                            height: '10px', width: '10px', borderRadius: '50%',
                            backgroundColor: 'var(--color-secondary)', display: 'inline-block'
                        }} />
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Live</span>
                    </div>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="btn"
                            style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)'
                            }}
                        >
                            Switch Role
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}
