import type { IProductModel } from "@models"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckIcon, ClockIcon, SparklesIcon, XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline"

interface ProductModalProps {
     product: IProductModel | null
     onClose: () => void
     onAddToCart: (quantity: number) => void
}

const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
     const [isAdding, setIsAdding] = useState(false)
     const [quantity, setQuantity] = useState(1)

     // Reset quantity when product changes
     useEffect(() => {
          if (product) setQuantity(1)
     }, [product])

     // --- SCROLL LOCK HOOK ---
     // Prevents background scrolling when modal is open
     useEffect(() => {
          if (product) {
               document.body.style.overflow = "hidden"
          } else {
               document.body.style.overflow = "unset"
          }

          // Cleanup: Ensure scroll is always restored if component unmounts
          return () => {
               document.body.style.overflow = "unset"
          }
     }, [product])

     // Close on Escape key
     useEffect(() => {
          const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
          window.addEventListener("keydown", handleEsc)
          return () => window.removeEventListener("keydown", handleEsc)
     }, [onClose])

     const handleAdd = () => {
          setIsAdding(true)
          setTimeout(() => {
               setIsAdding(false)
               onAddToCart(quantity)
               onClose()
          }, 800)
     }

     const adjustQuantity = (amount: number) => {
          setQuantity((prev) => {
               const newQty = prev + amount
               return newQty < 1 ? 1 : newQty
          })
     }

     return (
          <AnimatePresence>
               {product && (
                    <>
                         {/* Backdrop */}
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={onClose}
                              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
                         >
                              {/* Modal Content */}
                              <motion.div
                                   initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                   transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                   onClick={(e) => e.stopPropagation()}
                                   className="bg-stone-50 w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
                              >
                                   {/* Close Button */}
                                   <button
                                        onClick={onClose}
                                        className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/50 hover:bg-white text-stone-900 transition-colors"
                                   >
                                        <XMarkIcon className="w-6 h-6" />
                                   </button>

                                   {/* LEFT: Image */}
                                   <div className="w-full md:w-1/2 h-[300px] md:h-full relative bg-stone-200">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        {Boolean(product.isNew) && (
                                             <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest font-bold">
                                                  New Arrival
                                             </div>
                                        )}
                                   </div>

                                   {/* RIGHT: Details */}
                                   <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                                        <div className="mb-2">
                                             <span className="text-stone-400 text-xs uppercase tracking-[0.2em]">The Wax Atelier</span>
                                        </div>

                                        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 leading-tight">{product.name}</h2>

                                        {/* Price & Burn Time Row */}
                                        <div className="flex items-center gap-6 mb-8 text-sm">
                                             <span className="text-xl font-medium text-stone-900">€{product.price} EUR</span>
                                             <div className="w-px h-4 bg-stone-300"></div>
                                             <div className="flex items-center gap-2 text-stone-500">
                                                  <ClockIcon className="w-4 h-4" />
                                                  <span>{product.burnTime || "50 Hours"}</span>
                                             </div>
                                        </div>

                                        <p className="text-stone-600 font-light leading-relaxed mb-8 text-lg">
                                             {product.description ||
                                                  "A masterfully blended composition of natural waxes and essential oils, designed to transform your space into a sanctuary of calm."}
                                        </p>

                                        {/* Scent Notes Visuals */}
                                        <div className="mb-10">
                                             <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                                                  <SparklesIcon className="w-3 h-3" /> Olfactory Notes
                                             </h4>
                                             <div className="flex flex-wrap gap-3">
                                                  {product.scentNotes?.map((note, i) => (
                                                       <span
                                                            key={i}
                                                            className="px-4 py-2 border border-stone-200 rounded-full text-stone-600 text-xs uppercase tracking-wider hover:bg-stone-100 transition-colors cursor-default"
                                                       >
                                                            {note}
                                                       </span>
                                                  ))}
                                             </div>
                                        </div>

                                        {/* --- BOTTOM ACTION BAR --- */}
                                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                                             {/* QUANTITY SELECTOR */}
                                             <div className="flex items-center justify-between sm:justify-center bg-white border border-stone-200 rounded-xl px-2 py-2 sm:w-40 shrink-0">
                                                  <button
                                                       onClick={() => adjustQuantity(-1)}
                                                       disabled={quantity <= 1}
                                                       className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                                  >
                                                       <MinusIcon className="w-4 h-4" />
                                                  </button>

                                                  <div className="w-10 h-10 relative overflow-hidden flex items-center justify-center">
                                                       <AnimatePresence mode="popLayout" initial={false}>
                                                            <motion.span
                                                                 key={quantity}
                                                                 initial={{ y: 20, opacity: 0 }}
                                                                 animate={{ y: 0, opacity: 1 }}
                                                                 exit={{ y: -20, opacity: 0 }}
                                                                 transition={{ duration: 0.2 }}
                                                                 className="absolute text-lg font-medium text-stone-900"
                                                            >
                                                                 {quantity}
                                                            </motion.span>
                                                       </AnimatePresence>
                                                  </div>

                                                  <button
                                                       onClick={() => adjustQuantity(1)}
                                                       className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-900 transition-colors"
                                                  >
                                                       <PlusIcon className="w-4 h-4" />
                                                  </button>
                                             </div>

                                             {/* ADD BUTTON */}
                                             <button
                                                  onClick={handleAdd}
                                                  disabled={isAdding}
                                                  className="flex-1 bg-stone-900 text-white py-4 sm:py-0 rounded-xl uppercase tracking-[0.15em] text-xs font-bold hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-stone-900/10"
                                             >
                                                  {isAdding ? (
                                                       <>
                                                            <CheckIcon className="w-4 h-4" /> Added
                                                       </>
                                                  ) : (
                                                       <>
                                                            Add to Cart — €{(product.price * quantity).toFixed(2)}
                                                       </>
                                                  )}
                                             </button>
                                        </div>
                                   </div>
                              </motion.div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     )
}

export default ProductModal
