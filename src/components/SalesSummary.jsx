import React, { useMemo } from 'react'

export function SalesSummary({ contracts = [] }) {
    const stats = useMemo(() => {
        const summary = {}

        contracts.forEach(curr => {
            const name = curr.salesperson || 'Unknown'
            const cups = parseInt(curr.cupsCount) || 0

            if (!summary[name]) {
                summary[name] = { name, totalCups: 0, validCups: 0 }
            }

            summary[name].totalCups += cups

            // Calculate Valid Cups
            if (curr.statusDetails) {
                // Granular calculation
                const okCount = (parseInt(curr.statusDetails['OK']) || 0) + (parseInt(curr.statusDetails['OK RECUPERADO']) || 0)
                summary[name].validCups += okCount
            } else {
                // Backward compatibility / Simple status
                const isOk = curr.status === 'OK' || curr.status === 'OK RECUPERADO'
                if (isOk) {
                    summary[name].validCups += cups
                }
            }
        })

        return Object.values(summary).sort((a, b) => b.totalCups - a.totalCups)
    }, [contracts])

    if (stats.length === 0) return null

    return (
        <div className="card" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
            <h3 style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '1rem', fontWeight: 600 }}>
                Salesperson Performance
            </h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>Salesperson</th>
                            <th style={{ textAlign: 'center', padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>Total CUPS</th>
                            <th style={{ textAlign: 'center', padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>Valid CUPS (OK)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((stat) => (
                            <tr key={stat.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{stat.name}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{stat.totalCups}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
                                    {stat.validCups}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
