import { useContext, useMemo, useState } from "react"
import { AppContext } from "../../../app/App.tsx"
import { Loader2, Tag, X } from "lucide-react"
import axios from "axios"
import { COUPONS_CHECK_ENDPOINT } from "@endpoints"
import { isCustomAxiosError } from "../../../app/core/axiosCustomInterceptor.ts"

// Add prop interface
interface OrderSummaryProps {
     isMobile?: boolean
}

const OrderSummary = ({ isMobile = false }: OrderSummaryProps) => {
     const { cartItems: items, coupon, setCoupon } = useContext(AppContext)

     // Local state for input interaction
     const [couponCode, setCouponCode] = useState("")
     const [isLoading, setIsLoading] = useState(false)
     const [error, setError] = useState<string | null>(null)

     // 1. Calculate base totals
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

     // 2. Calculate Coupon Discount
     const couponDiscount = useMemo(() => {
          if (!coupon) return 0
          let discount = 0
          if (coupon.type === "PERCENTAGE") {
               discount = subtotal * (coupon.value / 100)
          } else {
               discount = coupon.value
          }
          return Math.min(discount, subtotal)
     }, [coupon, subtotal])

     const productSavings = originalTotal - subtotal
     const totalSavings = productSavings + couponDiscount
     const shipping = 15.0
     const finalTotal = subtotal - couponDiscount + shipping

     // --- HANDLERS ---
     const handleApplyCoupon = async () => {
          if (!couponCode.trim()) return
          setIsLoading(true)
          setError(null)

          try {
               const response = await axios.post(COUPONS_CHECK_ENDPOINT, {
                    code: couponCode,
                    subtotal: subtotal,
               })

               if (response.data.valid) {
                    setCoupon(response.data.coupon)
                    setCouponCode("")
               }
          } catch (err: any) {
               const defaultMessageError = "Invalid coupon code"
               if (isCustomAxiosError(err)) {
                    setError(err.customError?.message || defaultMessageError)
               } else {
                    setError(defaultMessageError)
               }
               setCoupon(null)
          } finally {
               setIsLoading(false)
          }
     }

     const handleRemoveCoupon = () => {
          setCoupon(null)
          setError(null)
     }

     // --- DYNAMIC STYLES ---
     // If mobile: simple div with padding.
     // If desktop: fixed sidebar with scrollbar.
     const containerClasses = isMobile
          ? "w-full bg-stone-50 border-b border-stone-200 p-6 animate-fade-in"
          : "hidden lg:block w-[450px] bg-stone-50 border-l border-stone-200 relative"

     const contentClasses = isMobile ? "space-y-6" : "sticky top-0 h-screen overflow-y-auto p-12"

     return (
          <div className={containerClasses}>
               <div className={contentClasses}>
                    {!isMobile && <h2 className="font-serif text-2xl text-stone-900 mb-8">Order Summary</h2>}

                    {/* Items List */}
                    <div className="space-y-6 mb-8">
                         {items.map(item => {
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
                                        <div className="flex flex-col items-end">
                                             <span className={`text-sm font-bold ${isDiscounted ? "text-red-900" : "text-stone-900"}`}>
                                                  ${(item.currentPrice * item.quantity).toFixed(2)}
                                             </span>
                                             {isDiscounted && <span className="text-xs text-stone-400 line-through">${(item.price * item.quantity).toFixed(2)}</span>}
                                        </div>
                                   </div>
                              )
                         })}
                    </div>

                    {!isMobile && <div className="border-t border-stone-200 my-8"></div>}

                    {/* Coupon Input Area */}
                    <div className="mb-8">
                         {coupon ? (
                              <div className="flex items-center justify-between bg-stone-200/50 p-3 rounded-xl border border-stone-200">
                                   <div className="flex items-center gap-2 text-stone-800">
                                        <Tag size={16} />
                                        <span className="text-sm font-bold tracking-wide uppercase">{coupon.code}</span>
                                        <span className="text-xs text-stone-500">({coupon.type === "PERCENTAGE" ? `-${coupon.value}%` : `-$${coupon.value}`})</span>
                                   </div>
                                   <button onClick={handleRemoveCoupon} className="text-stone-400 hover:text-red-500 transition-colors">
                                        <X size={18} />
                                   </button>
                              </div>
                         ) : (
                              <div className="flex gap-3 relative">
                                   <input
                                        type="text"
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                                        placeholder="Discount code"
                                        className={`flex-grow px-4 py-3 bg-white border rounded-xl text-sm outline-none transition-colors uppercase placeholder:normal-case ${error ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-900"}`}
                                   />
                                   <button
                                        onClick={handleApplyCoupon}
                                        disabled={isLoading || !couponCode}
                                        className="px-6 py-3 bg-stone-200 text-stone-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-300 transition-colors disabled:opacity-50 min-w-[80px] flex justify-center items-center"
                                   >
                                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Apply"}
                                   </button>
                              </div>
                         )}
                         {error && <p className="text-xs text-red-600 mt-2 ml-1">{error}</p>}
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-3 text-sm mb-8">
                         <div className="flex justify-between text-stone-500">
                              <span>Subtotal</span>
                              <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
                         </div>
                         {totalSavings > 0 && (
                              <div className="flex justify-between text-red-900 animate-in fade-in slide-in-from-top-1">
                                   <span>Total Savings</span>
                                   <span className="font-medium">-${totalSavings.toFixed(2)}</span>
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
                                   <span className="font-serif text-3xl text-stone-900 leading-none">${Math.max(0, finalTotal).toFixed(2)}</span>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default OrderSummary
