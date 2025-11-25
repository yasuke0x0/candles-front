import { useCallback, useContext, useEffect } from "react"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { AppContext } from "../../../app/App.tsx"
import { useNavigate } from "react-router-dom"

const CartDrawer = () => {
     const navigate = useNavigate()
     const { cartItems: items, setCartItems, isCartOpen: isOpen, setIsCartOpen } = useContext(AppContext)
     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

     const onClose = useCallback(() => setIsCartOpen(false), [setIsCartOpen])

     // --- SCROLL LOCK HOOK ---
     // Prevents background scrolling when drawer is open
     useEffect(() => {
          if (isOpen) {
               document.body.style.overflow = "hidden"
          } else {
               document.body.style.overflow = "unset"
          }
          return () => {
               document.body.style.overflow = "unset"
          }
     }, [isOpen])

     // --- CLOSE ON ESCAPE HOOK ---
     useEffect(() => {
          const handleEsc = (e: KeyboardEvent) => {
               if (e.key === "Escape" && isOpen) {
                    onClose()
               }
          }
          window.addEventListener("keydown", handleEsc)
          return () => window.removeEventListener("keydown", handleEsc)
     }, [isOpen, onClose])

     const onRemove = useCallback((id: number) => {
          setCartItems(prev => prev.filter(item => item.id !== id))
     }, [])

     const onUpdateQuantity = useCallback(
          (id: number, qty: number) => {
               if (qty < 1) {
                    onRemove(id)
                    return
               }
               setCartItems(prev => prev.map(item => (item.id === id ? { ...item, quantity: qty } : item)))
          },
          [onRemove]
     )

     const onCheckout = () => {
          setIsCartOpen(false) // Close the side drawer
          navigate("/cart") // Go to full page cart
     }

     return (
          <>
               {/* Backdrop */}
               <div
                    className={`fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    onClick={onClose}
               />

               {/* Drawer */}
               <div
                    className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${
                         isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
               >
                    <div className="flex flex-col h-full">
                         {/* Header */}
                         <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                              <h2 className="font-serif text-2xl text-stone-900">Your Cart</h2>
                              <button onClick={onClose} className="text-stone-400 hover:text-stone-800 transition-colors">
                                   <X size={24} />
                              </button>
                         </div>

                         {/* Items */}
                         <div className="flex-grow overflow-y-auto p-6 space-y-6">
                              {items.length === 0 ? (
                                   <div className="h-full flex flex-col items-center justify-center text-stone-400">
                                        <ShoppingBag size={48} className="mb-4 opacity-20" />
                                        <p>Your cart is empty.</p>
                                        <button
                                             onClick={onClose}
                                             className="mt-4 text-stone-800 underline underline-offset-4 text-sm font-medium hover:text-stone-600 transition-colors"
                                        >
                                             Continue Shopping
                                        </button>
                                   </div>
                              ) : (
                                   items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                             <div className="w-20 h-24 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                             </div>
                                             <div className="flex-grow flex flex-col justify-between">
                                                  <div className="flex justify-between items-start">
                                                       <div>
                                                            <h3 className="font-serif text-stone-900">{item.name}</h3>
                                                            <p className="text-xs text-stone-500">{item.scentNotes[0]}</p>
                                                       </div>
                                                       <span className="font-bold text-stone-900">${item.price * item.quantity}</span>
                                                  </div>

                                                  <div className="flex justify-between items-center">
                                                       <div className="flex items-center border border-stone-200 rounded-full">
                                                            <button
                                                                 onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                                 className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900"
                                                            >
                                                                 <Minus size={14} />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                            <button
                                                                 onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                                 className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900"
                                                            >
                                                                 <Plus size={14} />
                                                            </button>
                                                       </div>
                                                       <button onClick={() => onRemove(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                                                            <Trash2 size={18} />
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   ))
                              )}
                         </div>

                         {/* Footer */}
                         {items.length > 0 && (
                              <div className="p-6 bg-stone-50 border-t border-stone-100 space-y-4">
                                   <div>
                                        <div className="flex justify-between items-center mb-2">
                                             <span className="text-stone-600">Subtotal</span>
                                             <span className="font-bold text-lg text-stone-900">${total.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-stone-500">Shipping and taxes calculated at checkout.</p>
                                   </div>

                                   <div className="flex flex-col gap-3">
                                        <button
                                             onClick={onCheckout}
                                             className="w-full bg-stone-900 text-white py-4 rounded-full font-medium hover:bg-stone-800 transition-colors shadow-sm"
                                        >
                                             Checkout
                                        </button>
                                        <button
                                             onClick={onClose}
                                             className="w-full bg-white text-stone-900 border border-stone-200 py-4 rounded-full font-medium hover:bg-stone-50 transition-colors text-sm"
                                        >
                                             Continue Shopping
                                        </button>
                                   </div>
                              </div>
                         )}
                    </div>
               </div>
          </>
     )
}

export default CartDrawer
