import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import { AlertCircle, ArrowRight, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
import axios from "axios"
import { useAdminAuth } from "../core/AdminAuthContext"
import { LOGIN_ENDPOINT } from "@api-endpoints"

const LoginPage = () => {
     const { login } = useAdminAuth()
     const location = useLocation()
     const [isLoading, setIsLoading] = useState(false)
     const [error, setError] = useState<string | null>(null)
     const from = location.state?.from?.pathname || "/admin"

     const [formData, setFormData] = useState({ email: "admin@lumina.com", password: "password123" })

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
     }

     const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault()
          setIsLoading(true)
          setError(null)

          try {
               const response = await axios.post(LOGIN_ENDPOINT, {
                    email: formData.email,
                    password: formData.password,
               })
               const { token, user } = response.data

               if (!user.roles.includes("SUPER_ADMIN")) {
                    throw new Error("Access Denied.")
               }
               login(token.token, user, from)
          } catch (err: any) {
               console.error("Login Failed", err)
               setError(err.response?.data?.message || err.message || "Invalid credentials.")
               setIsLoading(false)
          }
     }

     return (
          <div className="min-h-screen w-full flex items-center justify-center bg-stone-100 p-4 md:p-6 lg:p-8">
               {/* Decorative Background Elements */}
               <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-stone-200/50 -skew-y-3 origin-top-left" />
                    <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-stone-200/30 rounded-full blur-3xl opacity-50" />
               </div>

               <div className="relative w-full max-w-md bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden backdrop-blur-sm">
                    {/* Header Section */}
                    <div className="p-8 md:p-10 pb-6 text-center">
                         <div className="mx-auto w-12 h-12 bg-stone-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-stone-900/20">
                              <ShieldCheck size={24} />
                         </div>
                         <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 tracking-tight">Lumina Admin</h1>
                         <p className="text-stone-500 text-sm md:text-base leading-relaxed">Welcome back. Please sign in to access your dashboard.</p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 md:px-10 pb-10">
                         {error && (
                              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-800 animate-in slide-in-from-top-2 shadow-sm">
                                   <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                   <div className="text-sm font-medium leading-relaxed">{error}</div>
                              </div>
                         )}

                         <form onSubmit={handleLogin} className="space-y-5">
                              <div className="space-y-1.5">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email</label>
                                   <div className="relative group">
                                        <input
                                             name="email"
                                             type="email"
                                             value={formData.email}
                                             onChange={handleChange}
                                             placeholder="name@example.com"
                                             className="w-full h-12 px-4 pl-11 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm font-medium placeholder:text-stone-300"
                                             required
                                        />
                                        <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-stone-900 transition-colors" />
                                   </div>
                              </div>

                              <div className="space-y-1.5">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400 ml-1">Password</label>
                                   <div className="relative group">
                                        <input
                                             name="password"
                                             type="password"
                                             value={formData.password}
                                             onChange={handleChange}
                                             placeholder="••••••••"
                                             className="w-full h-12 px-4 pl-11 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm font-medium placeholder:text-stone-300"
                                             required
                                        />
                                        <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-stone-900 transition-colors" />
                                   </div>
                              </div>

                              <button
                                   type="submit"
                                   disabled={isLoading}
                                   className="w-full h-12 bg-stone-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-stone-900/10 mt-2"
                              >
                                   {isLoading ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                   ) : (
                                        <>
                                             Sign In <ArrowRight className="w-4 h-4" />
                                        </>
                                   )}
                              </button>
                         </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-stone-50/50 p-4 text-center border-t border-stone-100">
                         <p className="text-[10px] text-stone-400 uppercase tracking-widest font-medium">Secured • Lumina Botanicals © 2025</p>
                    </div>
               </div>
          </div>
     )
}

export default LoginPage
