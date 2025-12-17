import React, { useState } from 'react'
import { Header } from './components/Header'
import { ContractForm } from './components/ContractForm'
import { ContractList } from './components/ContractList'
import { TimeFilter } from './components/TimeFilter'
import { ExportButton } from './components/ExportButton'
import { SalesSummary } from './components/SalesSummary'
import { SetupScreen } from './components/SetupScreen'
import { contractService } from './services/contracts'
import { supabase } from './lib/supabase'

import { ConfirmationModal } from './components/ConfirmationModal'
import { RoleSelection } from './components/RoleSelection'

const DEFAULT_TEAMS = {
    AMORAGA: ['Ian', 'Lizeth', 'Pablo', 'Formacion Amoraga'],
    DAVID: ['Pablo S', 'Pepe', 'Dario', 'Angel', 'Ivan', 'Dana', 'Marcos', 'Sean', 'Xavi', 'Pepe P', 'Formacion David'],
    SANDRA: []
}

function App() {

    const [userRole, setUserRole] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    // Dynamic Team Management - Persisted in LocalStorage
    const [teams, setTeams] = useState(() => {
        const saved = localStorage.getItem('teams_config_v2') // Bump version to include Sandra if coming from v1
        return saved ? JSON.parse(saved) : DEFAULT_TEAMS
    })

    // Derived list of all salespeople for Commercial login
    const salespeople = [...new Set([...teams.AMORAGA, ...teams.DAVID, ...(teams.SANDRA || [])])]

    React.useEffect(() => {
        localStorage.setItem('teams_config_v2', JSON.stringify(teams))
    }, [teams])

    const [contracts, setContracts] = useState([])
    const [timeFilter, setTimeFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteId, setDeleteId] = useState(null)

    const loadContracts = async () => {
        setLoading(true)
        try {
            const data = await contractService.fetchContracts()
            setContracts(data)
        } catch (err) {
            console.error(err)
            setError("Failed to load contracts. Please check your connection.")
        } finally {
            setLoading(false)
        }
    }

    const manageTeam = {
        add: (name) => {
            if (!name) return
            // Determine which team to add to based on User Role
            let targetTeam = 'AMORAGA'
            if (userRole === 'GERENTE_DAVID') targetTeam = 'DAVID'
            if (userRole === 'GERENTE_SANDRA') targetTeam = 'SANDRA'

            if (!teams[targetTeam].includes(name)) {
                setTeams(prev => ({
                    ...prev,
                    [targetTeam]: [...(prev[targetTeam] || []), name]
                }))
                alert(`Added ${name} to Team ${targetTeam}.`)
            }
        },
        remove: (name) => {
            if (confirm(`Remove ${name} from the team?`)) {
                setTeams(prev => {
                    const newTeams = { ...prev }
                    // Remove from whichever team they are in
                    newTeams.AMORAGA = newTeams.AMORAGA.filter(p => p !== name)
                    newTeams.DAVID = newTeams.DAVID.filter(p => p !== name)
                    if (newTeams.SANDRA) newTeams.SANDRA = newTeams.SANDRA.filter(p => p !== name)
                    return newTeams
                })
            }
        }
    }

    // Initial Fetch
    React.useEffect(() => {
        loadContracts()
    }, [])

    const addContract = async (newContract) => {
        try {
            const savedContract = await contractService.createContract(newContract)
            if (savedContract) {
                setContracts((prev) => [savedContract, ...prev])
                // Optional: Reload to ensure consistency, but keep optimistic update for speed
                // loadContracts() 
                return true
            }
        } catch (err) {
            console.error(err)
            throw err // Propagate to form for display
        }
    }

    // Triggered by Delete Button
    const requestDelete = (id) => {
        setDeleteId(id)
    }

    // Triggered by Modal Confirm
    const confirmDelete = async () => {
        if (!deleteId) return

        const { success, error } = await contractService.deleteContract(deleteId)
        if (success) {
            setContracts((prev) => prev.filter(c => c.id !== deleteId))
        } else {
            alert(`Failed to delete: ${error}`)
        }
        setDeleteId(null) // Close modal
    }

    const updateContractStatus = async (id, newStatusOrDetails) => {
        // Determine if input is a simple string or a details object
        const isDetails = typeof newStatusOrDetails === 'object' && newStatusOrDetails !== null

        // Optimistic UI Update
        const originalContracts = [...contracts]
        setContracts((prev) => prev.map(c => {
            if (c.id === id) {
                if (isDetails) {
                    // Update details and derive main status for display
                    // We need a helper here or just pick the first key/VARIOS
                    // For UI speed, let's just save it; the fetch will correct it.
                    return { ...c, statusDetails: newStatusOrDetails }
                } else {
                    // Simple string update
                    return { ...c, status: newStatusOrDetails, statusDetails: null }
                }
            }
            return c
        }))

        // Call Service
        // contracts.js service is smart enough to derive main status from details
        // But if passing a string, we need to handle that too.
        // Let's rely on contractService specific method signature or update it to be flexible.
        // Current contractService.updateStatus expects (id, newStatusDetails) OR (id, statusString)?
        // Let's check contractService code... it expects `newStatusDetails` object usually.
        // We should normalize it here or in service.

        // Let's pass it as is, and ensure service handles it.
        const success = await contractService.updateStatus(id, newStatusOrDetails)

        if (!success) {
            // Revert if failed
            setContracts(originalContracts)
            alert("Failed to update status in database.")
        } else {
            // Optional: Re-fetch to ensure everything is perfectly synced (calculated fields etc)
            loadContracts()
        }
    }

    const updateContractField = async (id, field, value) => {
        // Optimistic UI
        const originalContracts = [...contracts]
        setContracts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))

        const success = await contractService.updateContract(id, { [field]: value })
        if (!success) {
            setContracts(originalContracts)
            alert("Failed to update in database")
        }
    }

    const getFilteredContracts = () => {
        if (timeFilter === 'all') return contracts

        // Parse range: YYYY-MM-DD_YYYY-MM-DD
        const [startStr, endStr] = timeFilter.split('_')
        const [startYear, startMonth, startDay] = startStr.split('-').map(Number)
        const [endYear, endMonth, endDay] = endStr.split('-').map(Number)

        // Create Date objects (month is 0-indexed)
        const startDate = new Date(startYear, startMonth - 1, startDay)
        const endDate = new Date(endYear, endMonth - 1, endDay)

        return contracts.filter(contract => {
            if (!contract.date) return true // Safety check

            // Parse YYYY-MM-DD manually to avoid UTC/Local issues
            const [year, month, day] = contract.date.split('-').map(Number)
            const cDate = new Date(year, month - 1, day)

            return cDate >= startDate && cDate <= endDate
        })
    }

    const filteredContracts = getFilteredContracts() || []

    // Unified Filter Logic
    const getVisibleContracts = () => {
        let visible = filteredContracts // Time filtered first

        // 1. Commercial Filter: Only see own contracts
        if (userRole === 'COMERCIALES' && currentUser) {
            visible = visible.filter(c =>
                c.salesperson &&
                c.salesperson.trim().toLowerCase() === currentUser.trim().toLowerCase()
            )
        }

        // 2. Manager Filter: Only see own team contracts
        // If userRole is 'GERENTE' (legacy/super), show all (or could force selection)
        // If userRole is 'GERENTE_AMORAGA', show only Amoraga's team
        // If userRole is 'GERENTE_DAVID', show only David's team

        if (userRole === 'GERENTE_AMORAGA') {
            visible = visible.filter(c => teams.AMORAGA.includes(c.salesperson))
        }

        if (userRole === 'GERENTE_DAVID') {
            visible = visible.filter(c => teams.DAVID.includes(c.salesperson))
        }

        if (userRole === 'GERENTE_SANDRA') {
            visible = visible.filter(c => (teams.SANDRA || []).includes(c.salesperson))
        }

        return visible
    }

    const displayedContracts = getVisibleContracts()

    // Check Config
    if (!supabase) {
        return <SetupScreen />
    }

    if (!userRole) {
        return <RoleSelection
            salespeople={salespeople}
            onSelectRole={(role, name) => {
                setUserRole(role)
                if (name) setCurrentUser(name)
            }}
        />
    }

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading contracts...</div>
    }

    return (
        <div className="container">
            <Header onLogout={() => {
                setUserRole(null)
                setCurrentUser(null)
            }} />
            <main style={{ paddingBottom: '4rem' }}>
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}

                {/* Contract Form: Always visible now, but locked for commercials */}
                <div style={userRole === 'COMERCIALES' ? { marginBottom: '2rem' } : { opacity: 0.8, marginBottom: '2rem' }}>
                    {userRole === 'COMERCIALES' ? (
                        <ContractForm
                            onAdd={async (newContract) => {
                                await addContract(newContract)
                                alert("Contract added successfully!")
                            }}
                            lockedSalesperson={currentUser}
                            salespeople={salespeople}
                        />
                    ) : (
                        <details>
                            <summary style={{ cursor: 'pointer', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Admin: Add Manual Contract</summary>
                            <ContractForm
                                onAdd={addContract}
                                salespeople={
                                    userRole === 'GERENTE_AMORAGA' ? teams.AMORAGA :
                                        userRole === 'GERENTE_DAVID' ? teams.DAVID :
                                            userRole === 'GERENTE_SANDRA' ? (teams.SANDRA || []) :
                                                salespeople // Fallback for super-admin or mixed
                                }
                            />
                        </details>
                    )}
                </div>

                {/* Manager: Team Management Panel */}
                {userRole.startsWith('GERENTE') && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem' }}>
                        <details>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                Manage Team ({
                                    userRole === 'GERENTE_DAVID' ? 'David\'s Team' :
                                        userRole === 'GERENTE_SANDRA' ? 'Sandra\'s Team' :
                                            'Amoraga\'s Team'
                                })
                            </summary>
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <input
                                        type="text"
                                        id="newMember"
                                        placeholder="Name"
                                        className="input-field"
                                        style={{ width: 'auto', flex: 1 }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            const input = document.getElementById('newMember')
                                            manageTeam.add(input.value)
                                            input.value = ''
                                        }}
                                    >Add</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {/* Show only relevant team members for deletion */}
                                    {(
                                        userRole === 'GERENTE_DAVID' ? teams.DAVID :
                                            userRole === 'GERENTE_SANDRA' ? (teams.SANDRA || []) :
                                                teams.AMORAGA
                                    ).map(p => (
                                        <span key={p} style={{
                                            background: 'var(--color-surface)',
                                            border: '1px solid var(--color-border)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            {p}
                                            <button
                                                onClick={() => manageTeam.remove(p)}
                                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                            >×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </details>
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>
                        {userRole === 'COMERCIALES' ? `My Contracts (${currentUser})` : 'Dashboard Overview'}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                            Total: {displayedContracts.length}
                        </span>
                        <ExportButton contracts={displayedContracts} />
                    </div>
                </div>

                <TimeFilter currentFilter={timeFilter} onFilterChange={setTimeFilter} />

                {/* Only show SalesSummary to Manager to avoid comparison anxiety? Or show personal stats? 
                    User asked for "dashboard". Let's show it but it will only have 1 bar for them effectively. 
                */}
                <SalesSummary contracts={displayedContracts} />

                <ContractList
                    contracts={displayedContracts}
                    userRole={userRole}
                    onDelete={userRole && userRole.startsWith('GERENTE') ? requestDelete : null}
                    onUpdateStatus={updateContractStatus}
                    onUpdateField={updateContractField}
                />
            </main>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Contract"
                message="Are you sure you want to delete this contract? This action cannot be undone."
            />
        </div>
    )
}

export default App
