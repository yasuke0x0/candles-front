import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowRight, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { AppContext } from "../../app/App.tsx"
import { CART_STORAGE_KEY, CHECKOUT_FORM_STORAGE_KEY } from "@constants"

const OrderSuccessPage = () => {
     const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
     const [searchParams] = useSearchParams()
     const navigate = useNavigate()
     const { setCartItems, setCoupon } = useContext(AppContext)

     useEffect(() => {
          const redirectStatus = searchParams.get("redirect_status")

          if (redirectStatus === "failed") {
               // Redirecting back to checkout with failure param
               // We use a small timeout to allow the UI to mount if needed, or just redirect immediately.
               navigate("/checkout?step=3&redirect_status=failed")
               return
          } else {
               setStatus("success")
               // Clear cart on success
               setCartItems([])
               setCoupon(null)
               localStorage.removeItem(CART_STORAGE_KEY)
               localStorage.removeItem(CHECKOUT_FORM_STORAGE_KEY)
          }
     }, [searchParams, setCartItems, navigate])

     // --- ERROR STATE ---
     if (status === "error") {
          return (
               <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6">
                    <motion.div
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="text-center max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-red-50"
                    >
                         <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                              <XCircle className="w-8 h-8 text-red-500" />
                         </div>
                         <h1 className="font-serif text-3xl text-stone-900 mb-3">Payment Failed</h1>
                         <p className="text-stone-500 text-sm mb-8 leading-relaxed">We couldn't process your payment. Please check your details and try again.</p>
                         <button
                              onClick={() => navigate("/checkout")}
                              className="w-full bg-stone-900 text-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-stone-800 transition-colors shadow-lg"
                         >
                              Return to Checkout
                         </button>
                    </motion.div>
               </div>
          )
     }

     // --- SUCCESS STATE ---
     return (
          <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6 relative overflow-hidden font-sans">
               {/* Ambient Background Effects */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-orange-50/40 rounded-full blur-[120px]" />
                    <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-stone-100/60 rounded-full blur-[100px]" />
               </div>

               {/* The "Receipt" Card */}
               <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl shadow-stone-200/40 border border-stone-100 overflow-hidden z-10"
               >
                    {/* Decorative Top Border */}
                    <div className="h-1.5 w-full bg-stone-900" />

                    <div className="p-10 md:p-14 flex flex-col items-center text-center">
                         {/* Animated Check Icon */}
                         <div className="mb-8 relative">
                              <motion.div
                                   initial={{ scale: 0 }}
                                   animate={{ scale: 1 }}
                                   transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                                   className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center relative z-10 border border-stone-100"
                              >
                                   <svg
                                        className="w-8 h-8 text-stone-900"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                   >
                                        <motion.path
                                             d="M20 6L9 17l-5-5"
                                             initial={{ pathLength: 0 }}
                                             animate={{ pathLength: 1 }}
                                             transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                                        />
                                   </svg>
                              </motion.div>
                              {/* Pulse Effect */}
                              <motion.div
                                   initial={{ scale: 0.8, opacity: 0 }}
                                   animate={{ scale: 1.4, opacity: [0, 0.1, 0] }}
                                   transition={{ duration: 2, delay: 0.4, repeat: Infinity, repeatDelay: 1 }}
                                   className="absolute inset-0 rounded-full bg-stone-900 z-0"
                              />
                         </div>

                         {/* Text Content */}
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Order Confirmed</h2>
                              <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 leading-tight">
                                   The Scent is <br />
                                   <span className="italic font-light text-stone-500">Yours</span>
                              </h1>
                              <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                                   Thank you for choosing Lumina. We are carefully preparing your package. A confirmation has been sent to your email.
                              </p>
                         </motion.div>

                         {/* Receipt Divider Line */}
                         <div className="w-full border-t border-dashed border-stone-200 my-4 relative">
                              <div className="absolute -left-16 -top-3 w-6 h-6 bg-[#FDFCF8] rounded-full shadow-inner" />
                              <div className="absolute -right-16 -top-3 w-6 h-6 bg-[#FDFCF8] rounded-full shadow-inner" />
                         </div>

                         {/* Action Button */}
                         <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7, duration: 0.6 }}
                              onClick={() => navigate("/#shop")}
                              className="mt-6 bg-stone-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 active:scale-95 flex items-center gap-3 group"
                         >
                              <span>Continue Shopping</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </motion.button>
                    </div>
               </motion.div>
          </div>
     )
}

export default OrderSuccessPage
