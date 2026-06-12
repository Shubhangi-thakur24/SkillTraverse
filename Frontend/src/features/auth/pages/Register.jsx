import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const { loading, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ username, email, password })
        navigate("/")
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
                <h1>Create Account</h1>
                <p className="form-subtitle">Create a free account to get started with SkillTraverse</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" 
                            id="username" 
                            name='username' 
                            placeholder='Enter username' 
                            required
                        />
                    </div>
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

                    <button className='auth-submit-btn'>Register</button>
                </form>
                <p className="auth-footer-text">
                    Already have an account? <Link to={"/login"}>Login</Link>
                </p>
            </div>
        </main>
    )
}

export default Register