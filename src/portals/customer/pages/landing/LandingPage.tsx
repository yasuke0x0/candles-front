import { createContext, useCallback, useContext, useEffect, useState } from "react"
import Navbar from "./components/Navbar.tsx"
import Hero from "./components/Hero.tsx"
import About from "./components/About.tsx"
import ProductList from "./components/productList/ProductList.tsx"
import Newsletter from "./components/Newsletter.tsx"
import Footer from "./components/Footer.tsx"
import type { ILandingPageContext } from "./core/models.ts"
import { CustomerPortalContext } from "@portals/customer/CustomerPortal.tsx"

const LandingPage = () => {
     const { setIsCartOpen, cartItems, setCartItems } = useContext(CustomerPortalContext)
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
