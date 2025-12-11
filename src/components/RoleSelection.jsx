import React, { useState } from 'react'
import { Users, Briefcase, Lock, ArrowRight } from 'lucide-react'

export function RoleSelection({ onSelectRole, salespeople }) {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showSalesList, setShowSalesList] = useState(false)

    const handleManagerLogin = (e) => {
        e.preventDefault()
        if (password === 'amoraga31') {
            onSelectRole('GERENTE')
        } else {
            setError('Incorrect password')
            setPassword('')
        }
    }

    if (showSalesList) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                gap: '2rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Select Your Name</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Who is logging in?</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '1rem',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    {salespeople.map(name => (
                        <button
                            key={name}
                            onClick={() => onSelectRole('COMERCIALES', name)}
                            className="card"
                            style={{
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-surface)',
                                cursor: 'pointer',
                                padding: '1.5rem',
                                textAlign: 'center',
                                transition: 'all 0.2s',
                                fontSize: '1.1rem',
                                fontWeight: 500
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.borderColor = 'var(--color-primary)'
                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.borderColor = 'var(--color-border)'
                                e.currentTarget.style.background = 'var(--color-surface)'
                            }}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                <button
                    className="btn"
                    onClick={() => setShowSalesList(false)}
                    style={{ color: 'var(--color-text-muted)', background: 'transparent', marginTop: '1rem' }}
                >
                    Back to Roles
                </button>
            </div>
        )
    }

    if (showPassword) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            padding: '1rem',
                            borderRadius: '50%',
                            color: 'var(--color-primary)'
                        }}>
                            <Lock size={32} />
                        </div>
                    </div>

                    <h2 style={{ marginBottom: '0.5rem' }}>Gerente Access</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Please enter the administrator password.
                    </p>

                    <form onSubmit={handleManagerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="password"
                            autoFocus
                            placeholder="Password"
                            className="input-field"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                            style={{ textAlign: 'center' }}
                        />
                        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
                            Properties <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                        </button>

                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                setShowPassword(false)
                                setError('')
                                setPassword('')
                            }}
                            style={{ color: 'var(--color-text-muted)', background: 'transparent' }}
                        >
                            Back
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            gap: '2rem'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Contract Manager
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Select your role to continue</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', maxWidth: '600px', width: '100%' }}>
                {/* Commercials Button */}
                <button
                    onClick={() => setShowSalesList(true)}
                    className="card"
                    style={{
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        transition: 'transform 0.2s, border-color 0.2s',
                        color: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.borderColor = 'var(--color-primary)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.borderColor = 'var(--color-border)'
                    }}
                >
                    <div style={{
                        background: 'rgba(6, 182, 212, 0.1)',
                        padding: '1rem',
                        borderRadius: '50%',
                        color: 'var(--color-secondary)',
                        marginBottom: '1rem'
                    }}>
                        <Users size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>COMERCIALES</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                        Direct access for sales team
                    </p>
                </button>

                {/* Manager Button */}
                <button
                    onClick={() => setShowPassword(true)}
                    className="card"
                    style={{
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        transition: 'transform 0.2s, border-color 0.2s',
                        color: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.borderColor = 'var(--color-primary)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.borderColor = 'var(--color-border)'
                    }}
                >
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        padding: '1rem',
                        borderRadius: '50%',
                        color: 'var(--color-primary)',
                        marginBottom: '1rem'
                    }}>
                        <Briefcase size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>GERENTE</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                        Password protected area
                    </p>
                </button>
            </div>
        </div>
    )
}
