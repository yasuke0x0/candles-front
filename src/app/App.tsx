import { createContext, useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import type { ICartItemModel } from "@models"
import CartDrawer from "@pages/landing/components/CartDrawer.tsx"
import Cursor from "@components/Cursor.tsx"
import type { IAppContext } from "./core/models.ts"
import PublicRoutes from "../routes/PublicRoutes.tsx"
import ScrollHandler from "@components/ScrollHandler.tsx"
import { CART_STORAGE_KEY } from "@constants"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
     defaultOptions: {
          queries: {
               retry: false,
               refetchOnWindowFocus: false,
          },
     },
})

const App = () => {
     const [isCartOpen, setIsCartOpen] = useState(false)
     const [cartItems, setCartItems] = useState<ICartItemModel[]>(() => {
          try {
               const savedCart = localStorage.getItem(CART_STORAGE_KEY)
               return savedCart ? JSON.parse(savedCart) : []
          } catch (error) {
               console.error("Failed to load cart", error)
               return []
          }
     })

     // Save to LocalStorage whenever cart changes
     useEffect(() => {
          try {
               localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
          } catch (error) {
               console.error("Failed to save cart", error)
          }
     }, [cartItems])

     return (
          <QueryClientProvider client={queryClient}>
               <AppContext.Provider value={{ cartItems, setCartItems, isCartOpen, setIsCartOpen }}>
                    <BrowserRouter>
                         {/* -- AppContent Logic Moved Here -- */}
                         <ScrollHandler />
                         <Cursor />

                         <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
                              <PublicRoutes />
                         </div>

                         <CartDrawer />
                    </BrowserRouter>
               </AppContext.Provider>
          </QueryClientProvider>
     )
}

const AppContext = createContext({} as IAppContext)

export { AppContext, App }
