import React, { useEffect, useState } from "react"
import { Menu, ShoppingBag, X } from "lucide-react"

const Navbar: React.FC<NavbarProps> = ({ cartCount, toggleCart, scrolled }) => {
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

     // Prevent background scrolling when mobile menu is open
     useEffect(() => {
          if (isMobileMenuOpen) {
               document.body.style.overflow = "hidden"
          } else {
               document.body.style.overflow = "unset"
          }
          return () => {
               document.body.style.overflow = "unset"
          }
     }, [isMobileMenuOpen])

     // Determine navbar styles based on state
     const isNavActive = scrolled || isMobileMenuOpen

     const navBackgroundClass = isNavActive ? "bg-white/90 backdrop-blur-md border-b border-stone-100 py-4 shadow-sm" : "bg-transparent py-6 md:py-8"

     const textColorClass = isNavActive ? "text-stone-900" : "text-white"

     // Inverse colors for the badge so it stands out against the background/icons
     const badgeColors = isNavActive ? "bg-stone-900 text-white" : "bg-white text-stone-900"

     const navLinks = [
          { name: "Shop", href: "#shop" },
          { name: "About", href: "#about" },
          { name: "Newsletter", href: "#newsletter" },
     ]

     return (
          <>
               <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${navBackgroundClass}`}>
                    <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center">
                         {/* --- LOGO --- */}
                         <div className={`relative z-50 font-serif text-2xl md:text-3xl tracking-tight transition-colors duration-300 ${textColorClass}`}>
                              Lumina<span className="font-sans text-xs md:text-sm ml-1 tracking-[0.2em] uppercase opacity-70 font-light">Botanicals</span>
                         </div>

                         {/* --- DESKTOP MENU --- */}
                         <div className={`hidden md:flex items-center gap-10 lg:gap-14 transition-colors duration-300 ${textColorClass}`}>
                              {navLinks.map(item => (
                                   <a
                                        key={item.name}
                                        href={item.href}
                                        className="text-[11px] lg:text-xs uppercase tracking-[0.2em] font-bold hover:opacity-60 transition-all relative group"
                                   >
                                        {item.name}
                                        <span
                                             className={`absolute -bottom-2 left-0 w-0 h-[1px] transition-all duration-300 ease-out group-hover:w-full ${isNavActive ? "bg-stone-900" : "bg-white"}`}
                                        ></span>
                                   </a>
                              ))}
                         </div>

                         {/* --- ACTIONS --- */}
                         <div className={`relative z-50 flex items-center gap-6 transition-colors duration-300 ${textColorClass}`}>
                              <button
                                   onClick={toggleCart}
                                   // FIX: Added 'outline-none' to remove the ugly border on focus/escape
                                   className="relative group flex items-center gap-2 hover:opacity-70 transition-opacity outline-none"
                                   aria-label="Open cart"
                              >
                                   <ShoppingBag size={22} strokeWidth={1.2} />

                                   {/* Desktop Text */}
                                   <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block pt-1">Cart ({cartCount})</span>

                                   {/* Mobile/Tablet Badge - Only visible if items exist & screen is small */}
                                   {cartCount > 0 && (
                                        <span className={`absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold sm:hidden transition-colors duration-300 ${badgeColors}`}>
                                             {cartCount}
                                        </span>
                                   )}
                              </button>

                              {/* Mobile Toggle Button */}
                              <button
                                   className="md:hidden p-1 -mr-1 hover:opacity-70 transition-opacity outline-none"
                                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                   aria-label="Toggle menu"
                              >
                                   {isMobileMenuOpen ? <X size={26} strokeWidth={1} /> : <Menu size={26} strokeWidth={1} />}
                              </button>
                         </div>
                    </div>
               </nav>

               {/* --- MOBILE MENU OVERLAY --- */}
               <div
                    className={`fixed inset-0 bg-[#FAFAF9] z-40 flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.725,0.25,1)] ${
                         isMobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
                    }`}
               >
                    <div className="flex flex-col items-center gap-8">
                         {navLinks.map((item, index) => (
                              <a
                                   key={item.name}
                                   href={item.href}
                                   onClick={() => setIsMobileMenuOpen(false)}
                                   className={`font-serif text-4xl text-stone-900 hover:text-stone-500 hover:italic transition-all duration-300 transform ${
                                        isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                   }`}
                                   style={{ transitionDelay: `${index * 100}ms` }}
                              >
                                   {item.name}
                              </a>
                         ))}
                    </div>

                    <div
                         className={`absolute bottom-12 text-stone-400 text-[10px] uppercase tracking-[0.3em] transition-opacity duration-700 ${
                              isMobileMenuOpen ? "opacity-100 delay-500" : "opacity-0"
                         }`}
                    >
                         Est. 2024 • The Atelier
                    </div>
               </div>
          </>
     )
}

interface NavbarProps {
     cartCount: number
     toggleCart: () => void
     scrolled: boolean
}

export default Navbar
