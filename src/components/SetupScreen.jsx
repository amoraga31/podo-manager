
import React, { useState } from 'react'

export function SetupScreen() {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#09090b',
            color: 'white',
            padding: '2rem'
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
                maxWidth: '500px',
                textAlign: 'left'
            }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#10b981' }}>Base de Datos Requerida</h1>
                <p style={{ color: '#a1a1aa', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    Para usar esta aplicación en modo centralizado, necesitamos conectarla a tu proyecto de Supabase.
                </p>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Pasos para configurar:</p>
                    <ol style={{ paddingLeft: '1.5rem', color: '#d4d4d8', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Crea un proyecto en <a href="https://supabase.com" target="_blank" style={{ color: '#10b981' }}>Supabase.com</a>.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Ejecuta el script SQL de inicialización (te aparecerá abajo).</li>
                        <li>Copia la <strong>Project URL</strong> y la <strong>anon public key</strong>.</li>
                        <li>Pásame esos datos o configúralos en el archivo <code>.env</code> si estás desarrollando.</li>
                    </ol>
                </div>

                <div style={{ background: '#18181b', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                    <p style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>SQL Setup Script</p>
                    <code style={{ fontSize: '0.8rem', color: '#e4e4e7', whiteSpace: 'pre' }}>
                        {`create table contracts (
  id text primary key,
  client_name text not null,
  type text,
  status text,
  cups_count integer default 0,
  salesperson text,
  date text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);`}
                    </code>
                </div>
            </div>
        </div>
    )
}
