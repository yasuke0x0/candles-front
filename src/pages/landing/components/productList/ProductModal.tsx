import type { IProductModel } from "@models"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckIcon, ClockIcon, SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline"

const ProductModal = ({ product, onClose, onAddToCart }: { product: IProductModel | null; onClose: () => void; onAddToCart: () => void }) => {
     const [isAdding, setIsAdding] = useState(false)

     // Close on Escape key
     useEffect(() => {
          const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
          window.addEventListener("keydown", handleEsc)
          return () => window.removeEventListener("keydown", handleEsc)
     }, [onClose])

     const handleAdd = () => {
          setIsAdding(true)
          onAddToCart()
          setTimeout(() => {
               setIsAdding(false)
               onClose() // Optional: close modal after adding
          }, 1500)
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
                                   transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Elegant ease
                                   onClick={e => e.stopPropagation()}
                                   className="bg-stone-50 w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
                              >
                                   {/* Close Button */}
                                   <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/50 hover:bg-white text-stone-900 transition-colors">
                                        <XMarkIcon className="w-6 h-6" />
                                   </button>

                                   {/* LEFT: Image */}
                                   <div className="w-full md:w-1/2 h-[300px] md:h-full relative bg-stone-200">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        {/* Tag Overlay */}
                                        {Boolean(product.isNew) && (
                                             <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest font-bold">
                                                  New Arrival
                                             </div>
                                        )}
                                   </div>

                                   {/* RIGHT: Details */}
                                   <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
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

                                        {/* Action Button */}
                                        <button
                                             onClick={handleAdd}
                                             disabled={isAdding}
                                             className="w-full bg-stone-900 text-white py-5 rounded-xl uppercase tracking-[0.15em] text-xs font-bold hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                             {isAdding ? (
                                                  <>
                                                       <CheckIcon className="w-4 h-4" /> Added to Cart
                                                  </>
                                             ) : (
                                                  <>Add to Cart — €{product.price}</>
                                             )}
                                        </button>
                                   </div>
                              </motion.div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     )
}

export default ProductModal
