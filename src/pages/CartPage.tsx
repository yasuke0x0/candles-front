import React from "react"
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import type { CartItem } from "../types.ts"

const CartPage: React.FC<CartPageProps> = ({ items, onRemove, onUpdateQuantity, total, onCheckout, onContinueShopping }) => {
     return (
          <div className="min-h-screen bg-white py-12 px-6 md:px-12 lg:px-24">
               <div className="max-w-4xl mx-auto">
                    {/* Header / Back Link */}
                    <div className="mb-10">
                         <button
                              onClick={onContinueShopping}
                              className="flex items-center text-xs uppercase tracking-widest font-bold text-stone-500 hover:text-stone-900 transition-colors mb-8 group"
                         >
                              <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                              Continue Shopping
                         </button>

                         <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Your Cart</h1>
                    </div>

                    {items.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-20 text-stone-400 bg-stone-50 rounded-lg">
                              <ShoppingBag size={64} className="mb-6 opacity-20" />
                              <p className="text-lg font-serif text-stone-600 mb-2">Your cart is currently empty.</p>
                              <button
                                   onClick={onContinueShopping}
                                   className="mt-6 bg-stone-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
                              >
                                   Start Shopping
                              </button>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                              {/* Left Column: Cart Items */}
                              <div className="lg:col-span-2 space-y-8">
                                   {items.map(item => (
                                        <div key={item.id} className="flex gap-6 py-6 border-b border-stone-100 last:border-0">
                                             {/* Image */}
                                             <div className="w-24 h-32 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                             </div>

                                             {/* Details */}
                                             <div className="flex-grow flex flex-col justify-between py-1">
                                                  <div className="flex justify-between items-start">
                                                       <div>
                                                            <h3 className="font-serif text-lg text-stone-900 mb-1">{item.name}</h3>
                                                            <p className="text-sm text-stone-500 font-light">{item.scentNotes.join(" • ")}</p>
                                                       </div>
                                                       <span className="font-medium text-stone-900">${(item.price * item.quantity).toFixed(2)}</span>
                                                  </div>

                                                  <div className="flex justify-between items-end">
                                                       {/* Quantity Control */}
                                                       <div className="flex items-center border border-stone-200 rounded-full">
                                                            <button
                                                                 onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                                 className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
                                                            >
                                                                 <Minus size={14} />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-medium text-stone-900">{item.quantity}</span>
                                                            <button
                                                                 onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                                 className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
                                                            >
                                                                 <Plus size={14} />
                                                            </button>
                                                       </div>

                                                       {/* Remove Button */}
                                                       <button
                                                            onClick={() => onRemove(item.id)}
                                                            className="text-stone-400 hover:text-red-500 transition-colors p-2"
                                                            aria-label="Remove item"
                                                       >
                                                            <Trash2 size={18} />
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>

                              {/* Right Column: Order Summary */}
                              <div className="lg:col-span-1">
                                   <div className="bg-stone-50 p-8 rounded-lg sticky top-8">
                                        <h2 className="font-serif text-xl text-stone-900 mb-6">Order Summary</h2>

                                        <div className="space-y-4 mb-6 pb-6 border-b border-stone-200">
                                             <div className="flex justify-between text-sm">
                                                  <span className="text-stone-600">Subtotal</span>
                                                  <span className="font-medium text-stone-900">${total.toFixed(2)}</span>
                                             </div>
                                             <div className="flex justify-between text-sm">
                                                  <span className="text-stone-600">Shipping</span>
                                                  <span className="text-stone-500 italic">Calculated at checkout</span>
                                             </div>
                                        </div>

                                        <div className="flex justify-between items-end mb-8">
                                             <span className="font-serif text-lg text-stone-900">Total</span>
                                             <span className="font-serif text-2xl text-stone-900">${total.toFixed(2)}</span>
                                        </div>

                                        <button
                                             onClick={onCheckout}
                                             className="w-full bg-stone-900 text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors mb-4"
                                        >
                                             Proceed to Checkout
                                        </button>

                                        <p className="text-center text-xs text-stone-400">Secure Checkout • Free Shipping over $100</p>
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     )
}

interface CartPageProps {
     items: CartItem[]
     onRemove: (id: number) => void
     onUpdateQuantity: (id: number, qty: number) => void
     total: number
     onCheckout: () => void
     onContinueShopping: () => void
}

export default CartPage
