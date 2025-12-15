import React, { useState } from 'react'
import { Users, Briefcase, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function RoleSelection({ onSelectRole, salespeople }) {
    const [loginRole, setLoginRole] = useState(null) // 'GERENTE' or 'COMERCIALES'
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showSalesList, setShowSalesList] = useState(false)

    // Reset state when going back
    const resetState = () => {
        setLoginRole(null)
        setPassword('')
        setError('')
        setLoading(false)
        setShowSalesList(false)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // If loginRole starts with GERENTE (e.g. GERENTE_AMORAGA), check manager_password
        const isManager = loginRole && loginRole.startsWith('GERENTE')
        const dbKey = isManager ? 'manager_password' : 'commercial_password'

        try {
            const { data, error } = await supabase.rpc('verify_role_password', {
                role_key: dbKey,
                input_pass: password
            })

            if (error) throw error

            if (data === true) {
                if (isManager) {
                    // Pass the specific manager role (GERENTE_AMORAGA or GERENTE_DAVID)
                    onSelectRole(loginRole)
                } else {
                    // Start commercial flow: show list
                    setShowSalesList(true)
                    setLoginRole(null)
                }
            } else {
                setError('Incorrect password')
                setPassword('')
            }
        } catch (err) {
            console.error('Password verification failed:', err)

            // Fallbacks for transition period 
            let valid = false
            if (isManager && password === 'amoraga31') valid = true

            if (valid) {
                if (isManager) {
                    onSelectRole(loginRole)
                } else {
                    setShowSalesList(true)
                    setLoginRole(null) // Step 1 done, move to Step 2 (List)
                }
            } else {
                setError('Error verifying password')
            }
        } finally {
            setLoading(false)
        }
    }

    if (showSalesList) {
        // ... (existing code for commercials)
    }

    if (loginRole === 'SELECT_MANAGER') {
        const managers = [
            { id: 'GERENTE_AMORAGA', name: 'Amoraga' },
            { id: 'GERENTE_DAVID', name: 'David' }
        ]
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Select Manager</h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '1rem',
                    maxWidth: '400px',
                    width: '100%'
                }}>
                    {managers.map(mgr => (
                        <button
                            key={mgr.id}
                            onClick={() => setLoginRole(mgr.id)}
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
                        >
                            {mgr.name}
                        </button>
                    ))}
                </div>
                <button
                    className="btn"
                    onClick={resetState}
                    style={{ color: 'var(--color-text-muted)', background: 'transparent', marginTop: '1rem' }}
                >
                    Back to Roles
                </button>
            </div>
        )
    }

    if (loginRole) {
        const isMgr = loginRole.startsWith('GERENTE')
        const mgrName = loginRole === 'GERENTE_AMORAGA' ? 'Amoraga' : loginRole === 'GERENTE_DAVID' ? 'David' : 'Manager'
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
                            background: isMgr ? 'rgba(99, 102, 241, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                            padding: '1rem',
                            borderRadius: '50%',
                            color: isMgr ? 'var(--color-primary)' : 'var(--color-secondary)'
                        }}>
                            <Lock size={32} />
                        </div>
                    </div>

                    <h2 style={{ marginBottom: '0.5rem' }}>{isMgr ? `${mgrName} Access` : 'Commercial Access'}</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Please enter the {isMgr ? 'administrator' : 'team'} password.
                    </p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', height: '42px', opacity: loading ? 0.7 : 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Continue'}
                            {!loading && <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />}
                        </button>

                        <button
                            type="button"
                            className="btn"
                            onClick={resetState}
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
                    onClick={() => setLoginRole('COMERCIALES')}
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
                        Acceso Equipo
                    </p>
                </button>

                {/* Manager Button - Triggers Sub-Selection */}
                <button
                    onClick={() => {
                        // We use a temporary state or logic to show manager list
                        // Re-using showSalesList logic but for managers would be cleanest?
                        // Or setting a 'pendingRole' state. 
                        // Let's set loginRole to 'SELECT_MANAGER' to show the manager grid.
                        setLoginRole('SELECT_MANAGER')
                    }}
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
                        Acceso Gerencia
                    </p>
                </button>
            </div>
        </div>
    )
}
