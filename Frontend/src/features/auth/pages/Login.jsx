import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
    }

    if (loading) {
        return (
            <main className='auth-page'>
                <div className='radar-loader'>
                    <div className='radar-loader__circle radar-loader__circle--1' />
                    <div className='radar-loader__circle radar-loader__circle--2' />
                    <div className='radar-loader__circle radar-loader__circle--3' />
                </div>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="form-card">
                <h1>Welcome Back</h1>
                <p className="form-subtitle">Sign in to your SkillTraverse workspace</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" 
                            id="email" 
                            name='email' 
                            placeholder='Enter email address' 
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" 
                            id="password" 
                            name='password' 
                            placeholder='Enter password' 
                            required
                        />
                    </div>
                    <button className='auth-submit-btn'>Sign In</button>
                </form>
                <p className="auth-footer-text">
                    Don&apos;t have an account? <Link to={"/register"}>Register</Link>
                </p>
            </div>
        </main>
    )
}

export default Login