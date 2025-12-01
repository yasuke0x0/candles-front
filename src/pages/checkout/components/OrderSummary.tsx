import { useContext, useMemo } from "react"
import { AppContext } from "../../../app/App.tsx"

const OrderSummary = () => {
     const { cartItems: items } = useContext(AppContext)

     // 1. Calculate totals using currentPrice (actual selling price) vs price (original)
     const { subtotal, originalTotal } = useMemo(() => {
          return items.reduce(
               (acc, item) => {
                    acc.subtotal += item.currentPrice * item.quantity
                    acc.originalTotal += item.price * item.quantity
                    return acc
               },
               { subtotal: 0, originalTotal: 0 }
          )
     }, [items])

     const savings = originalTotal - subtotal
     const shipping = 15.0
     const finalTotal = subtotal + shipping

     return (
          <div className="hidden lg:block w-[450px] bg-stone-50 border-l border-stone-200 relative">
               <div className="sticky top-0 h-screen overflow-y-auto p-12">
                    <h2 className="font-serif text-2xl text-stone-900 mb-8">Order Summary</h2>

                    <div className="space-y-6 mb-8">
                         {items.map(item => {
                              // Check if item is on sale
                              const isDiscounted = item.price > item.currentPrice

                              return (
                                   <div key={item.id} className="flex gap-4 items-center group">
                                        <div className="relative flex-shrink-0">
                                             <div className="w-16 h-20 bg-white rounded-lg border border-stone-200 overflow-hidden">
                                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                             </div>
                                             <span className="absolute -top-2 -right-2 w-5 h-5 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md z-10">
                                                  {item.quantity}
                                             </span>
                                        </div>

                                        <div className="flex-grow">
                                             <h4 className="font-serif text-stone-900 text-sm group-hover:underline">{item.name}</h4>
                                             <p className="text-xs text-stone-500 uppercase tracking-wide mt-0.5">{item.scentNotes[0]}</p>
                                        </div>

                                        {/* Price Column */}
                                        <div className="flex flex-col items-end">
                                             <span className={`text-sm font-bold ${isDiscounted ? "text-red-900" : "text-stone-900"}`}>
                                                  ${(item.currentPrice * item.quantity).toFixed(2)}
                                             </span>
                                             {isDiscounted && (
                                                  <span className="text-xs text-stone-400 line-through">
                                                       ${(item.price * item.quantity).toFixed(2)}
                                                  </span>
                                             )}
                                        </div>
                                   </div>
                              )
                         })}
                    </div>

                    <div className="border-t border-stone-200 my-8"></div>

                    <div className="flex gap-3 mb-8">
                         <input
                              type="text"
                              placeholder="Discount code"
                              className="flex-grow px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-900 transition-colors uppercase placeholder:normal-case"
                         />
                         <button className="px-6 py-3 bg-stone-200 text-stone-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-300 transition-colors disabled:opacity-50">
                              Apply
                         </button>
                    </div>

                    <div className="space-y-3 text-sm mb-8">
                         <div className="flex justify-between text-stone-500">
                              <span>Subtotal</span>
                              <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
                         </div>

                         {/* Show Savings Row if applicable */}
                         {savings > 0 && (
                              <div className="flex justify-between text-red-900">
                                   <span>Savings</span>
                                   <span className="font-medium">-${savings.toFixed(2)}</span>
                              </div>
                         )}

                         <div className="flex justify-between text-stone-500">
                              <span>Shipping</span>
                              <span className="font-medium text-stone-900">${shipping.toFixed(2)}</span>
                         </div>
                    </div>

                    <div className="border-t border-stone-200 pt-8">
                         <div className="flex justify-between items-end">
                              <span className="font-serif text-xl text-stone-900">Total</span>
                              <div className="text-right">
                                   <span className="text-[10px] text-stone-400 uppercase tracking-widest mr-2 align-middle">USD</span>
                                   <span className="font-serif text-3xl text-stone-900 leading-none">${finalTotal.toFixed(2)}</span>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default OrderSummary
