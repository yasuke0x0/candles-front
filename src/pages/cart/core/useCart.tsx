import { useContext } from "react"
import type { IProductModel } from "@models"
import { AppContext } from "../../../app/App.tsx"

const useCart = () => {
     const { setCartItems, setIsCartOpen } = useContext(AppContext)

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
