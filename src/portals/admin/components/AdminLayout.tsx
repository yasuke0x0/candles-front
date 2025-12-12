import { Suspense, useEffect, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Tag, Users, X } from "lucide-react"
import { AnimatePresence, motion, type Variants } from "framer-motion" // 1. Import Variants type
import AdminLoader from "./AdminLoader"
import { useAdminAuth } from "../core/AdminAuthContext"

// --- CONSTANTS & VARIANTS ---
const navItems = [
     { icon: LayoutDashboard, label: "Overview", path: "/admin" },
     { icon: Package, label: "Products", path: "/admin/products" },
     { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
     { icon: Users, label: "Customers", path: "/admin/customers" },
     { icon: Tag, label: "Coupons", path: "/admin/coupons" },
]

// 2. Add type annotation here
const sidebarVariants: Variants = {
     collapsed: {
          width: "5rem",
          transition: { duration: 0.3, ease: "easeInOut", delay: 0.1 },
     },
     expanded: {
          width: "16rem",
          transition: { duration: 0.3, ease: "easeInOut" },
     },
}

// 2. Add type annotation here
const textVariants: Variants = {
     collapsed: {
          opacity: 0,
          width: 0,
          display: "none",
          transition: { duration: 0.1 },
     },
     expanded: {
          opacity: 1,
          width: "auto",
          display: "block",
          transition: { delay: 0.15, duration: 0.2 },
     },
}

// --- SUB-COMPONENT ---
interface SidebarContentProps {
     isMobile?: boolean
     isHovered?: boolean
     setIsMobileMenuOpen: (val: boolean) => void
     logout: () => void
}

const SidebarContent = ({ isMobile = false, isHovered = false, setIsMobileMenuOpen, logout }: SidebarContentProps) => {
     const state = isMobile ? "expanded" : isHovered ? "expanded" : "collapsed"

     return (
          <>
               {/* Header */}
               <div
                    className={`h-20 flex items-center border-b border-stone-100 whitespace-nowrap overflow-hidden transition-all duration-300 ${state === "expanded" ? "px-6 justify-start gap-4" : "justify-center px-0"}`}
               >
                    <div className="w-10 h-10 bg-stone-900 rounded-xl flex shrink-0 items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-stone-900/20">
                         L
                    </div>

                    <motion.div variants={textVariants} initial="collapsed" animate={state}>
                         <span className="font-serif text-lg tracking-tight text-stone-900 font-bold">Lumina</span>
                    </motion.div>

                    {isMobile && (
                         <button onClick={() => setIsMobileMenuOpen(false)} className="ml-auto p-2 text-stone-400 hover:text-stone-900 bg-stone-50 rounded-lg transition-colors">
                              <X size={20} />
                         </button>
                    )}
               </div>

               {/* Navigation */}
               <nav className="flex-1 py-6 flex flex-col gap-2 overflow-x-hidden overflow-y-auto scrollbar-thin px-3">
                    {navItems.map(item => (
                         <NavLink
                              key={item.path}
                              to={item.path}
                              end={item.path === "/admin"}
                              onClick={() => isMobile && setIsMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                   `flex items-center rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap h-12 ${
                                        isActive ? "bg-stone-900 text-white shadow-md shadow-stone-900/10" : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                                   } ${state === "expanded" ? "px-4 gap-4" : "justify-center px-0"}`
                              }
                         >
                              <item.icon size={20} strokeWidth={2} className="shrink-0" />

                              <motion.span variants={textVariants} initial="collapsed" animate={state} className="text-sm font-medium">
                                   {item.label}
                              </motion.span>
                         </NavLink>
                    ))}
               </nav>

               {/* Footer */}
               <div className="p-4 border-t border-stone-100 overflow-hidden">
                    <button
                         onClick={logout}
                         className={`flex items-center rounded-xl w-full h-12 transition-colors duration-200 text-stone-500 hover:bg-red-50 hover:text-red-600 group ${state === "expanded" ? "px-4 gap-4" : "justify-center"}`}
                    >
                         <LogOut size={20} className="shrink-0" />
                         <motion.span variants={textVariants} initial="collapsed" animate={state} className="text-sm font-medium whitespace-nowrap">
                              Logout
                         </motion.span>
                    </button>
               </div>
          </>
     )
}

// --- MAIN LAYOUT ---
const AdminLayout = () => {
     const { logout, user } = useAdminAuth()
     const location = useLocation()
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
     const [isHovered, setIsHovered] = useState(false)

     useEffect(() => {
          setIsMobileMenuOpen(false)
     }, [location.pathname])

     return (
          <div className="flex h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden">
               {/* --- DESKTOP SIDEBAR --- */}
               <motion.aside
                    initial="collapsed"
                    animate={isHovered ? "expanded" : "collapsed"}
                    variants={sidebarVariants}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="hidden lg:flex bg-white border-r border-stone-200 flex-col z-30 shadow-xl shadow-stone-200/20 overflow-hidden"
               >
                    <SidebarContent isMobile={false} isHovered={isHovered} setIsMobileMenuOpen={setIsMobileMenuOpen} logout={logout} />
               </motion.aside>

               {/* --- MOBILE MENU OVERLAY --- */}
               <AnimatePresence>
                    {isMobileMenuOpen && (
                         <div className="fixed inset-0 z-50 lg:hidden pointer-events-auto">
                              {/* Backdrop Fade */}
                              <motion.div
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   exit={{ opacity: 0 }}
                                   transition={{ duration: 0.2 }}
                                   className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm"
                                   onClick={() => setIsMobileMenuOpen(false)}
                              />

                              {/* Drawer Slide */}
                              <motion.div
                                   initial={{ x: "-100%" }}
                                   animate={{ x: 0 }}
                                   exit={{ x: "-100%" }}
                                   transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                                   className="absolute inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-2xl flex flex-col"
                              >
                                   <SidebarContent isMobile={true} setIsMobileMenuOpen={setIsMobileMenuOpen} logout={logout} />
                              </motion.div>
                         </div>
                    )}
               </AnimatePresence>

               {/* --- MAIN CONTENT AREA --- */}
               <main className="flex-1 flex flex-col min-w-0 bg-stone-50/50 relative transition-all duration-300">
                    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-stone-200 px-6 md:px-10 flex items-center justify-between z-20 shrink-0 sticky top-0">
                         <div className="flex items-center gap-4">
                              <button
                                   onClick={() => setIsMobileMenuOpen(true)}
                                   className="lg:hidden p-2 -ml-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                              >
                                   <Menu size={24} />
                              </button>

                              <div>
                                   <h2 className="font-serif text-2xl text-stone-900 tracking-tight">Dashboard</h2>
                                   <p className="hidden md:block text-xs text-stone-400 font-medium mt-0.5">Welcome back, {user?.firstName}</p>
                              </div>
                         </div>

                         <div className="flex items-center gap-4 md:gap-6">
                              <button className="p-2.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors hidden sm:block">
                                   <Settings size={20} />
                              </button>

                              <div className="flex items-center gap-3 pl-0 md:pl-6 md:border-l border-stone-200">
                                   <div className="text-right hidden md:block">
                                        <p className="text-sm font-bold text-stone-900 leading-none">
                                             {user?.firstName} {user?.lastName}
                                        </p>
                                        <div className="flex items-center justify-end gap-1 mt-1.5">
                                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                             <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Online</p>
                                        </div>
                                   </div>
                                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-800 to-stone-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-lg shadow-stone-200 cursor-pointer hover:scale-105 transition-transform">
                                        {user?.firstName?.[0]}
                                        {user?.lastName?.[0]}
                                   </div>
                              </div>
                         </div>
                    </header>

                    <div className="flex-1 overflow-hidden relative">
                         <Suspense fallback={<AdminLoader />} key={location.pathname}>
                              <Outlet />
                         </Suspense>
                    </div>
               </main>
          </div>
     )
}

export default AdminLayout
