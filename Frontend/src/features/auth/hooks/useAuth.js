import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            localStorage.setItem("isLoggedIn", "true")
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.msg || err.response?.data?.message || "Login failed. Please verify your connection and credentials.")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            localStorage.setItem("isLoggedIn", "true")
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.msg || err.response?.data?.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
            localStorage.removeItem("isLoggedIn")
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            if (localStorage.getItem("isLoggedIn") !== "true") {
                setLoading(false)
                return
            }
            try {
                const data = await getMe()
                if(data && data.user) {
                    setUser(data.user)
                } else {
                    localStorage.removeItem("isLoggedIn")
                }
            } catch (err) { 
                console.log(err)
                localStorage.removeItem("isLoggedIn")
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [setUser, setLoading])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}