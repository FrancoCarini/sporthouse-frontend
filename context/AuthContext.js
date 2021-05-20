import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { NEXT_URL } from '@/config/index'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    checkUserLoggedIn()
  }, [])

  // Register User
  const register = async (user) => {
    const res = await fetch(`${NEXT_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    
    const data = await res.json()

    if (res.success) {
      setUser(data.user) 
      router.push('/')
    } else {
      setError(data.message)
      setError(null)
    }
  }

  // Login User
  const login = async ({email, password}) => {
    setLoading(true)
    const res = await fetch(`${NEXT_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    
    const data = await res.json()

    if (data.success) {
      setLoading(false)
      setUser(data.user) 
      router.push('/')
    } else {
      setError(data.message)
      setLoading(false)
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  // Logout
  const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: 'POST'
    })

    // Ver de usar Status Code
    if (res.ok) {
      setUser(null)
      router.push('/')
    }
  }

  const checkUserLoggedIn = async () => {
    const res = await fetch(`${NEXT_URL}/api/user`)
    const data = await res.json()

    if (res.ok) {
      setUser(data.user)
    } else {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user, 
      error, 
      register, 
      login, 
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
