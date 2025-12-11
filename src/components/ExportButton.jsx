import React from 'react'
import { Download } from 'lucide-react'

export function ExportButton({ contracts }) {
    const handleExport = () => {
        if (!contracts || contracts.length === 0) {
            alert("No contracts to export!")
            return
        }

        // CSV Headers
        const headers = ["Date", "Client", "Type", "Status", "Status Details", "CUPS", "Salesperson"]

        // Convert contracts to CSV rows
        const rows = contracts.map(c => [
            c.date || '',
            c.clientName,
            c.type,
            c.status,
            c.statusDetails ? JSON.stringify(c.statusDetails).replace(/"/g, "'") : '', // simplistic export for details
            c.cupsCount,
            c.salesperson
        ])

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
        ].join('\n')

        // Create Blob and Download Link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')

        const date = new Date().toISOString().split('T')[0]
        link.setAttribute('href', url)
        link.setAttribute('download', `contracts_export_${date}.csv`)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <button
            onClick={handleExport}
            className="btn"
            style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                height: '36px'
            }}
        >
            <Download size={16} /> Export Excel
        </button>
    )
}
