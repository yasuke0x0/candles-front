import React, { useCallback, useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import type { CartItem, Product } from "./types"
import Navbar from "./pages/Navbar.tsx"
import Hero from "./pages/Hero.tsx"
import ProductList from "./pages/ProductList.tsx"
import Footer from "./pages/Footer.tsx"
import Features from "./pages/Features.tsx"
import Cursor from "./pages/Cursor.tsx"
import CartPage from "./pages/CartPage.tsx"
import Checkout from "./pages/Checkout.tsx"
import CartDrawer from "./components/CartDrawer.tsx"

// --- MOCK PRODUCT DATA ---
const PRODUCTS: Product[] = [
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

// --- SUB-COMPONENTS ---

const Newsletter: React.FC = () => (
     <section id="newsletter" className="py-24 bg-stone-50 px-6 border-t border-stone-200">
          <div className="max-w-4xl mx-auto text-center reveal">
               <h3 className="font-serif text-3xl md:text-4xl mb-6 text-stone-900">Join the Lumina Circle</h3>
               <p className="text-stone-500 mb-10 text-lg max-w-lg mx-auto">Receive exclusive access to new collections, scent profiling, and members-only events.</p>
               <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
                    <input
                         type="email"
                         placeholder="Your email address"
                         className="flex-grow bg-white border border-stone-300 px-6 py-4 focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-400 cursor-none"
                    />
                    <button className="bg-stone-900 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                         Subscribe
                    </button>
               </form>
          </div>
     </section>
)

// --- HELPERS ---

const ScrollToTop = () => {
     const { pathname } = useLocation()
     useEffect(() => {
          window.scrollTo(0, 0)
     }, [pathname])
     return null
}

const useHashScroll = () => {
     const { hash } = useLocation()
     useEffect(() => {
          if (hash) {
               const element = document.getElementById(hash.replace("#", ""))
               if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
               }
          }
     }, [hash])
}

// --- PAGES ---

// 1. Landing Page
interface LandingPageProps {
     cartCount: number
     toggleCart: () => void
     addToCart: (product: Product) => void
}

const LandingPage: React.FC<LandingPageProps> = ({ cartCount, toggleCart, addToCart }) => {
     const [scrolled, setScrolled] = useState(false)

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
          <>
               <Navbar cartCount={cartCount} toggleCart={toggleCart} scrolled={scrolled} />
               <main className="flex-grow">
                    <Hero />
                    <Features />
                    {/* ID 'shop' is crucial for the hash link to work */}
                    <div id="shop">
                         <ProductList products={PRODUCTS} addToCart={addToCart} />
                    </div>
                    <Newsletter />
               </main>
               <Footer />
          </>
     )
}

// --- MAIN APP LOGIC ---

const AppContent: React.FC = () => {
     const navigate = useNavigate()

     // This hook ensures that if we navigate to '/#shop', it scrolls down.
     useHashScroll()

     // --- Global State (with LocalStorage Persistence) ---
     const [cartItems, setCartItems] = useState<CartItem[]>(() => {
          try {
               const savedCart = localStorage.getItem("lumina_cart")
               return savedCart ? JSON.parse(savedCart) : []
          } catch (error) {
               console.error("Failed to load cart", error)
               return []
          }
     })

     const [isCartOpen, setIsCartOpen] = useState(false)

     // Save to LocalStorage whenever cart changes
     useEffect(() => {
          try {
               localStorage.setItem("lumina_cart", JSON.stringify(cartItems))
          } catch (error) {
               console.error("Failed to save cart", error)
          }
     }, [cartItems])

     // --- Actions ---
     const addToCart = useCallback((product: Product) => {
          setCartItems(prev => {
               const existing = prev.find(item => item.id === product.id)
               if (existing) {
                    return prev.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
               }
               return [...prev, { ...product, quantity: 1 }]
          })
          setIsCartOpen(true)
     }, [])

     const removeFromCart = useCallback((id: number) => {
          setCartItems(prev => prev.filter(item => item.id !== id))
     }, [])

     const updateQuantity = useCallback(
          (id: number, qty: number) => {
               if (qty < 1) {
                    removeFromCart(id)
                    return
               }
               setCartItems(prev => prev.map(item => (item.id === id ? { ...item, quantity: qty } : item)))
          },
          [removeFromCart]
     )

     const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

     // --- Navigation Handlers ---

     const handleViewCartPage = () => {
          setIsCartOpen(false) // Close the side drawer
          navigate("/cart") // Go to full page cart
     }

     const handleCheckoutStart = () => {
          navigate("/checkout")
     }

     const handleContinueShopping = () => {
          // Go to home page and scroll to the shop section
          navigate("/#shop")
     }

     const handleCheckoutComplete = (details: any) => {
          console.log("Order Placed:", details)
          setCartItems([]) // Clear state
          localStorage.removeItem("lumina_cart") // Clear storage
          navigate("/")
          alert("Thank you for your order!")
     }

     // --- Calculations ---
     const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
     const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

     return (
          <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
               <ScrollToTop />
               <Cursor />

               <Routes>
                    {/* Route 1: Landing Page */}
                    <Route path="/" element={<LandingPage cartCount={cartCount} toggleCart={toggleCart} addToCart={addToCart} />} />

                    {/* Route 2: Full Screen Cart Page */}
                    <Route
                         path="/cart"
                         element={
                              <CartPage
                                   items={cartItems}
                                   total={cartTotal}
                                   onRemove={removeFromCart}
                                   onUpdateQuantity={updateQuantity}
                                   onCheckout={handleCheckoutStart}
                                   onContinueShopping={handleContinueShopping} // Takes user back to #shop
                              />
                         }
                    />

                    {/* Route 3: Checkout Page */}
                    <Route
                         path="/checkout"
                         element={
                              <Checkout
                                   items={cartItems}
                                   total={cartTotal}
                                   // Back button on checkout goes to Cart Page to review items
                                   onBack={() => navigate("/cart")}
                                   onCompleteOrder={handleCheckoutComplete}
                              />
                         }
                    />
               </Routes>

               {/* Global Cart Drawer (Overlays everything) */}
               <CartDrawer
                    isOpen={isCartOpen}
                    onClose={toggleCart}
                    items={cartItems}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    total={cartTotal}
                    onCheckout={handleViewCartPage} // Drawer button goes to full cart page first
               />
          </div>
     )
}

const App: React.FC = () => {
     return (
          <Router>
               <AppContent />
          </Router>
     )
}

export default App
