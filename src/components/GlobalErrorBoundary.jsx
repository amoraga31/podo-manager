import React from 'react'

export class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo)
        this.setState({ errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    background: '#18181b',
                    color: '#ef4444',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Something went wrong.</h2>
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        maxWidth: '800px',
                        overflow: 'auto',
                        textAlign: 'left',
                        fontFamily: 'monospace'
                    }}>
                        <p style={{ fontWeight: 'bold' }}>{this.state.error?.toString()}</p>
                        <pre style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            padding: '0.75rem 1.5rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        Reload App
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
