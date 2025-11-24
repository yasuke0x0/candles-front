import { useCallback, useContext } from "react"
import type { IProductModel } from "@models"
import { AppContext } from "../../../app/App.tsx"

const useCart = () => {
     const { setCartItems, setIsCartOpen } = useContext(AppContext)

     const addToCart = useCallback((product: IProductModel) => {
          setCartItems(prev => {
               const existing = prev.find(item => item.id === product.id)
               if (existing) {
                    return prev.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
               }
               return [...prev, { ...product, quantity: 1 }]
          })
          setIsCartOpen(true)
     }, [])

     return { addToCart }
}

export default useCart
