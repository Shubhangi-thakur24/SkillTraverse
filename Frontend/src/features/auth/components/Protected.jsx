import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return (
            <div className="premium-loading">
                <div className="loading-card">
                    <div className="radar-loader">
                        <svg className="radar-loader__icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="3 11 22 2 13 21 11 13 3 11" />
                        </svg>
                        <div className="radar-loader__circle radar-loader__circle--1"></div>
                        <div className="radar-loader__circle radar-loader__circle--2"></div>
                        <div className="radar-loader__circle radar-loader__circle--3"></div>
                    </div>
                </div>
            </div>
        )
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected