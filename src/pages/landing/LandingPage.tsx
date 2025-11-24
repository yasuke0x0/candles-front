import type { IProductModel } from "@models"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import Navbar from "@pages/landing/components/Navbar.tsx"
import Hero from "@pages/landing/components/Hero.tsx"
import About from "@pages/landing/components/About.tsx"
import ProductList from "@pages/landing/components/ProductList.tsx"
import Newsletter from "@pages/landing/components/Newsletter.tsx"
import Footer from "@pages/landing/components/Footer.tsx"
import type { ILandingPageContext } from "@pages/landing/core/models.ts"
import { AppContext } from "../../app/App.tsx"
import useCart from "@pages/cart/core/useCart.tsx"

const LandingPage = () => {
     const { setIsCartOpen, cartItems, setCartItems } = useContext(AppContext)
     const { addToCart } = useCart()
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
                    <ProductList products={PRODUCTS} addToCart={addToCart} />
                    <Newsletter />
               </main>
               <Footer />
          </LandingPageContext.Provider>
     )
}

const LandingPageContext = createContext({} as ILandingPageContext)

const PRODUCTS: IProductModel[] = [
     {
          id: 1,
          name: "Midnight Amber",
          description: "A warm, resinous blend of amber, sandalwood, and a touch of vanilla orchid.",
          price: 32,
          image: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&q=80&w=800",
          scentNotes: ["Amber", "Sandalwood", "Vanilla"],
          burnTime: "45-50 hours",
          isNew: true,
     },
     {
          id: 2,
          name: "Sage & Sea Salt",
          description: "Fresh oceanic breeze meeting the earthy aroma of wild sage.",
          price: 28,
          image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
          scentNotes: ["Sea Salt", "Sage", "Driftwood"],
          burnTime: "40-45 hours",
     },
     {
          id: 3,
          name: "Lavender Haze",
          description: "French lavender essential oil blended with eucalyptus for a spa-like experience.",
          price: 30,
          image: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&q=80&w=800",
          scentNotes: ["Lavender", "Eucalyptus", "White Tea"],
          burnTime: "45-50 hours",
     },
     {
          id: 4,
          name: "Cedar & Tobacco",
          description: "A masculine, sophisticated scent with notes of cured tobacco leaf.",
          price: 34,
          image: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&q=80&w=800",
          scentNotes: ["Tobacco", "Cedar", "Leather"],
          burnTime: "50-55 hours",
     },
     {
          id: 5,
          name: "Golden Pear",
          description: "Sweet ripened pears simmered in brandy and spices.",
          price: 28,
          image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
          scentNotes: ["Pear", "Cinnamon", "Brandy"],
          burnTime: "40-45 hours",
     },
     {
          id: 6,
          name: "White Tea & Ginger",
          description: "Delicate white tea leaves with a zest of ginger and lemon.",
          price: 30,
          image: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&q=80&w=800",
          scentNotes: ["White Tea", "Ginger", "Lemon"],
          burnTime: "45-50 hours",
     },
]

export { LandingPage }
