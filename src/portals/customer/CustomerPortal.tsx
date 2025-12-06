import { createContext, type Dispatch, type SetStateAction, useEffect, useState } from "react"

// Components
import Cursor from "../../components/Cursor"
import ScrollHandler from "../../components/ScrollHandler"
import CustomerRoutes from "./CustomerRoutes"
import type { ICartItemModel, ICoupon } from "@api-models"
import { CART_STORAGE_KEY } from "./constants"
import CartDrawer from "@portals/customer/pages/landing/components/CartDrawer.tsx"

const CustomerPortal = () => {
     const [isCartOpen, setIsCartOpen] = useState(false)
     const [coupon, setCoupon] = useState<ICoupon | null>(null)

     const [cartItems, setCartItems] = useState<ICartItemModel[]>(() => {
          try {
               const savedCart = localStorage.getItem(CART_STORAGE_KEY)
               return savedCart ? JSON.parse(savedCart) : []
          } catch (error) {
               console.error("Failed to load cart", error)
               return []
          }
     })

     useEffect(() => {
          try {
               localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
          } catch (error) {
               console.error("Failed to save cart", error)
          }
     }, [cartItems])

     return (
          <CustomerPortalContext.Provider value={{ cartItems, setCartItems, isCartOpen, setIsCartOpen, coupon, setCoupon }}>
               <ScrollHandler />
               <Cursor />

               <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
                    <CustomerRoutes />
               </div>

               <CartDrawer />
          </CustomerPortalContext.Provider>
     )
}

export interface ICustomerPortalContext {
     cartItems: ICartItemModel[]
     setCartItems: Dispatch<SetStateAction<ICartItemModel[]>>
     isCartOpen: boolean
     setIsCartOpen: Dispatch<SetStateAction<boolean>>
     coupon: ICoupon | null
     setCoupon: Dispatch<SetStateAction<ICoupon | null>>
}

export const CustomerPortalContext = createContext({} as ICustomerPortalContext)

export default CustomerPortal
