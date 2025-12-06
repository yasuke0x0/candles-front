import { createContext, type ReactNode, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom" // Removed useLocation
import axios from "axios"
import { AUTH_ME_ENDPOINT } from "@api-endpoints"

interface AdminUser {
     id: number
     email: string
     firstName: string
     lastName: string
     roles: string[]
}

interface AdminContextType {
     user: AdminUser | null
     isAuthenticated: boolean
     isLoading: boolean
     login: (token: string, user: AdminUser, callbackUrl?: string) => void // Added callbackUrl
     logout: () => void
}

const AdminAuthContext = createContext<AdminContextType | null>(null)

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
     const [user, setUser] = useState<AdminUser | null>(null)
     const [isLoading, setIsLoading] = useState(true)
     const navigate = useNavigate()

     // 1. Initialize Session on Mount
     useEffect(() => {
          const initSession = async () => {
               const token = localStorage.getItem("admin_token")
               const savedUser = localStorage.getItem("admin_user")

               if (token && savedUser) {
                    // Optimistically set user so UI renders immediately
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
                    setUser(JSON.parse(savedUser))

                    // BACKGROUND VERIFICATION:
                    // Check if token is actually valid with the backend.
                    // If this fails (401), the interceptor will usually handle it,
                    // but we catch it here to be safe.
                    try {
                         await axios.get(AUTH_ME_ENDPOINT)
                    } catch (e) {
                         console.warn("Session invalid, logging out...")
                         logout()
                    }
               }
               setIsLoading(false)
          }
          initSession()
     }, [])

     // 2. Login Action
     // Added 'callbackUrl' to redirect user back to where they came from
     const login = (token: string, userData: AdminUser, callbackUrl: string = "/admin") => {
          localStorage.setItem("admin_token", token)
          localStorage.setItem("admin_user", JSON.stringify(userData))
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          setUser(userData)

          // Navigate to the requested page OR dashboard
          navigate(callbackUrl, { replace: true })
     }

     // 3. Logout Action
     const logout = () => {
          localStorage.removeItem("admin_token")
          localStorage.removeItem("admin_user")
          delete axios.defaults.headers.common["Authorization"]
          setUser(null)
          navigate("/admin/login", { replace: true })
     }

     return (
          <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
               {children}
          </AdminAuthContext.Provider>
     )
}

export const useAdminAuth = () => {
     const context = useContext(AdminAuthContext)
     if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider")
     return context
}
