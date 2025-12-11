import React, { useMemo } from 'react'

export function TimeFilter({ currentFilter, onFilterChange }) {
    // 1. Generate Months for 2025 and 2026
    const months = useMemo(() => {
        const list = []
        const years = [2025, 2026]
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        years.forEach(year => {
            monthNames.forEach((name, index) => {
                // Calculate start and end of month
                const daysInMonth = new Date(year, index + 1, 0).getDate()
                const startStr = `${year}-${String(index + 1).padStart(2, '0')}-01`
                const endStr = `${year}-${String(index + 1).padStart(2, '0')}-${daysInMonth}`

                list.push({
                    label: `${name} ${year}`,
                    value: `${startStr}_${endStr}`, // Whole month range
                    year,
                    monthIndex: index
                })
            })
        })
        return list
    }, [])

    // 2. Derive Active Month from currentFilter
    const activeMonthParam = useMemo(() => {
        if (currentFilter === 'all') return null
        // Format: YYYY-MM-DD_YYYY-MM-DD
        // We just look at the start date: YYYY-MM
        try {
            const [start] = currentFilter.split('_')
            const [y, m] = start.split('-')
            return { year: parseInt(y), monthIndex: parseInt(m) - 1 }
        } catch (e) {
            return null
        }
    }, [currentFilter])

    // 3. Generate Weeks if a month is active
    const weeks = useMemo(() => {
        if (!activeMonthParam) return []

        const { year, monthIndex } = activeMonthParam
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
        const list = []

        let startDay = 1
        while (startDay <= daysInMonth) {
            const endDay = Math.min(startDay + 6, daysInMonth)

            const startStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`
            const endStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`

            list.push({
                label: `${startDay}-${endDay}`,
                value: `${startStr}_${endStr}`
            })
            startDay += 7
        }
        return list
    }, [activeMonthParam])


    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

            {/* Level 1: Months (Horizontal Scroll) */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
                <button
                    onClick={() => onFilterChange('all')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: '1px solid transparent',
                        cursor: 'pointer',
                        backgroundColor: currentFilter === 'all' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
                        color: currentFilter === 'all' ? 'white' : 'var(--color-text-muted)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    All Time
                </button>

                {months.map((m) => {
                    // Check if this month is "active" (either selected directly OR a week within it is selected)
                    const isActive = activeMonthParam && activeMonthParam.year === m.year && activeMonthParam.monthIndex === m.monthIndex

                    return (
                        <button
                            key={m.value}
                            onClick={() => onFilterChange(m.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 600 : 400,
                                border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                                cursor: 'pointer',
                                backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            {m.label}
                        </button>
                    )
                })}
            </div>

            {/* Level 2: Weeks (Only visible if a month is active) */}
            {weeks.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', paddingLeft: '0.5rem', borderLeft: '2px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', marginRight: '0.5rem' }}>Weeks:</span>
                    {weeks.map((w) => (
                        <button
                            key={w.value}
                            onClick={() => onFilterChange(w.value)}
                            style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '0.5rem', // Different shape for weeks
                                fontSize: '0.8rem',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: currentFilter === w.value ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
                                color: currentFilter === w.value ? 'white' : 'var(--color-text-muted)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {w.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
