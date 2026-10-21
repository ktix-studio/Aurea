'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')

  const submit = async (e: any) => {
    e.preventDefault()
    setMsg('Checking...')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    if (data.success) {
      setMsg('✅ Welcome ' + data.name + '!')
    } else {
      setMsg('❌ Wrong email/password')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>
      <form onSubmit={submit} style={{ background: 'white', padding: '40px', borderRadius: '20px', width: '350px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid #E8DCC6' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome Back</h1>
        <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>AUREA Atelier</p>
        <input placeholder="Email" type="email" required style={inputStyle} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" required style={inputStyle} onChange={e => setForm({...form, password: e.target.value})} />
        <button style={btnStyle}>Login</button>
        <p style={{ marginTop: '16px', fontSize: '13px' }}>{msg}</p>
        <p style={{ marginTop: '16px', fontSize: '13px' }}>New here? <Link href="/signup" style={{ color: '#C8A96A', fontWeight: 'bold' }}>Create account</Link></p>
      </form>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #E8DCC6', outline: 'none' } as any
const btnStyle = { width: '100%', padding: '12px', background: '#111', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' } as any
