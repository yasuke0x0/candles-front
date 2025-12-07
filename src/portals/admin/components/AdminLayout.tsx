import { Suspense, useEffect, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Tag, Users, X } from "lucide-react"
import AdminLoader from "./AdminLoader"
import { useAdminAuth } from "../core/AdminAuthContext"

const AdminLayout = () => {
     const { logout, user } = useAdminAuth()
     const location = useLocation()
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

     // Close mobile menu when route changes
     useEffect(() => {
          setIsMobileMenuOpen(false)
     }, [location.pathname])

     const navItems = [
          { icon: LayoutDashboard, label: "Overview", path: "/admin" },
          { icon: Package, label: "Products", path: "/admin/products" },
          { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
          { icon: Users, label: "Customers", path: "/admin/customers" },
          { icon: Tag, label: "Coupons", path: "/admin/coupons" },
     ]

     const SidebarContent = () => (
          <>
               {/* Sidebar Header */}
               <div className="p-6 md:p-8 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg shadow-md shadow-stone-900/20">
                              L
                         </div>
                         <span className="font-serif text-lg tracking-tight text-stone-900">Lumina Admin</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors">
                         <X size={20} />
                    </button>
               </div>

               {/* Navigation Links */}
               <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Menu</div>
                    {navItems.map(item => (
                         <NavLink
                              key={item.path}
                              to={item.path}
                              end={item.path === "/admin"}
                              className={({ isActive }) =>
                                   `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                        isActive ? "bg-stone-900 text-white shadow-md shadow-stone-900/10 translate-x-1" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                                   }`
                              }
                         >
                              <item.icon size={20} strokeWidth={2} className="transition-transform group-hover:scale-110 opacity-80" />
                              {item.label}
                         </NavLink>
                    ))}
               </nav>

               {/* Sidebar Footer */}
               <div className="p-4 border-t border-stone-100">
                    <button
                         onClick={logout}
                         className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors group"
                    >
                         <LogOut size={20} className="group-hover:-translate-x-1 transition-transform opacity-80" />
                         Logout
                    </button>
               </div>
          </>
     )

     return (
          <div className="flex h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden">
               {/* --- DESKTOP SIDEBAR (Visible on lg+) --- */}
               <aside className="hidden lg:flex w-72 bg-white border-r border-stone-200 flex-col z-30 shadow-sm">
                    <SidebarContent />
               </aside>

               {/* --- MOBILE MENU OVERLAY --- */}
               {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                         {/* Backdrop */}
                         <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)} />
                         {/* Drawer */}
                         <div className="absolute inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                              <SidebarContent />
                         </div>
                    </div>
               )}

               {/* --- MAIN CONTENT AREA --- */}
               <main className="flex-1 flex flex-col min-w-0 bg-stone-50/50 relative">
                    {/* Header */}
                    <header className="h-16 md:h-20 bg-white/80 backdrop-blur border-b border-stone-200 px-4 md:px-8 flex items-center justify-between z-20 shrink-0">
                         <div className="flex items-center gap-4">
                              {/* Mobile Hamburger */}
                              <button
                                   onClick={() => setIsMobileMenuOpen(true)}
                                   className="lg:hidden p-2 -ml-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                              >
                                   <Menu size={24} />
                              </button>
                              <h2 className="font-serif text-xl md:text-2xl text-stone-900">Dashboard</h2>
                         </div>

                         <div className="flex items-center gap-3 md:gap-6">
                              <button className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors hidden sm:block">
                                   <Settings size={20} />
                              </button>

                              {/* User Profile */}
                              <div className="flex items-center gap-3 pl-0 md:pl-6 md:border-l border-stone-200">
                                   <div className="text-right hidden md:block">
                                        <p className="text-sm font-bold text-stone-900 leading-none">
                                             {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1.5 font-bold">Super Admin</p>
                                   </div>
                                   <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-md shadow-stone-200 cursor-pointer">
                                        {user?.firstName?.[0]}
                                        {user?.lastName?.[0]}
                                   </div>
                              </div>
                         </div>
                    </header>

                    {/* FIX: Removed 'p-4 md:p-8 overflow-y-auto'.
                         Changed to 'overflow-hidden' so child pages handle their own scrolling
                         and can have full-width headers.
                    */}
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
