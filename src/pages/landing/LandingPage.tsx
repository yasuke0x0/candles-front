import { createContext, useCallback, useContext, useEffect, useState } from "react"
import Navbar from "@pages/landing/components/Navbar.tsx"
import Hero from "@pages/landing/components/Hero.tsx"
import About from "@pages/landing/components/About.tsx"
import ProductList from "@pages/landing/components/ProductList.tsx"
import Newsletter from "@pages/landing/components/Newsletter.tsx"
import Footer from "@pages/landing/components/Footer.tsx"
import type { ILandingPageContext } from "@pages/landing/core/models.ts"
import { AppContext } from "../../app/App.tsx"

const LandingPage = () => {
     const { setIsCartOpen, cartItems, setCartItems } = useContext(AppContext)
     const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

     const [scrolled, setScrolled] = useState(false)

     const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

     useEffect(() => {
          const handleScroll = () => setScrolled(window.scrollY > 20)
          window.addEventListener("scroll", handleScroll)

          const observer = new IntersectionObserver(
               entries => {
                    entries.forEach(entry => {
                         if (entry.isIntersecting) entry.target.classList.add("active")
                    })
               },
               { threshold: 0.1 }
          )

          const reveals = document.querySelectorAll(".reveal")
          reveals.forEach(el => observer.observe(el))

          return () => {
               window.removeEventListener("scroll", handleScroll)
               reveals.forEach(el => observer.unobserve(el))
          }
     }, [])

     return (
          <LandingPageContext.Provider value={{ cartItems, setCartItems }}>
               <Navbar cartCount={cartCount} toggleCart={toggleCart} scrolled={scrolled} />
               <main className="flex-grow">
                    <Hero />
                    <About />
                    <ProductList />
                    <Newsletter />
               </main>
               <Footer />
          </LandingPageContext.Provider>
     )
}

const LandingPageContext = createContext({} as ILandingPageContext)

export { LandingPage }
