import { useContext } from "react"
import { CustomerPortalContext } from "@portals/customer/CustomerPortal.tsx"
import type { IProductModel } from "@api-models"

const useCart = () => {
     const { setCartItems, setIsCartOpen } = useContext(CustomerPortalContext)

     function addToCart(product: IProductModel, quantity: number = 1) {
          setCartItems(prev => {
               const existing = prev.find(item => item.id === product.id)
               if (existing) {
                    return prev.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
               }
               return [...prev, { ...product, quantity: quantity }]
          })
          setIsCartOpen(true)
     }

     return { addToCart }
}

export default useCart
