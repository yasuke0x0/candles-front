import React, { useEffect, useState } from "react"
import { Menu, ShoppingBag, X } from "lucide-react"

interface NavbarProps {
     cartCount: number
     toggleCart: () => void
     scrolled: boolean
}

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
                         {/* z-50 ensures logo stays above the mobile menu overlay */}
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
                                        {/* Hover Underline Animation */}
                                        <span
                                             className={`absolute -bottom-2 left-0 w-0 h-[1px] transition-all duration-300 ease-out group-hover:w-full ${isNavActive ? "bg-stone-900" : "bg-white"}`}
                                        ></span>
                                   </a>
                              ))}
                         </div>

                         {/* --- ACTIONS --- */}
                         {/* z-50 ensures buttons stay above the mobile menu overlay */}
                         <div className={`relative z-50 flex items-center gap-6 transition-colors duration-300 ${textColorClass}`}>
                              <button onClick={toggleCart} className="relative group flex items-center gap-2 hover:opacity-70 transition-opacity" aria-label="Open cart">
                                   <ShoppingBag size={22} strokeWidth={1.2} />
                                   <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block pt-1">Cart ({cartCount})</span>
                              </button>

                              {/* Mobile Toggle Button */}
                              <button
                                   className="md:hidden p-1 -mr-1 hover:opacity-70 transition-opacity"
                                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                   aria-label="Toggle menu"
                              >
                                   {isMobileMenuOpen ? <X size={26} strokeWidth={1} /> : <Menu size={26} strokeWidth={1} />}
                              </button>
                         </div>
                    </div>
               </nav>

               {/* --- MOBILE MENU OVERLAY --- */}
               {/* 1. Fixed inset-0 covers the whole screen.
         2. z-40 places it UNDER the Logo/Buttons (z-50) but OVER page content.
         3. Uses visibility/opacity for a smoother fade/slide effect than just translation.
      */}
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
                                   style={{ transitionDelay: `${index * 100}ms` }} // Staggered animation
                              >
                                   {item.name}
                              </a>
                         ))}
                    </div>

                    {/* Decorative footer for mobile menu */}
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

export default Navbar
