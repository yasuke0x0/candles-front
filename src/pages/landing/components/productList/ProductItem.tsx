import type { IProductModel } from "@models"
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckIcon, ShoppingBagIcon, EyeIcon } from "@heroicons/react/24/outline"

const ProductItem = ({
                          product,
                          index,
                          onAddToCart,
                          onQuickView,
                     }: {
     product: IProductModel
     index: number
     onAddToCart: () => void
     onQuickView: () => void
}) => {
     const [isAdding, setIsAdding] = useState(false)

     const handleAddToCart = (e: React.MouseEvent) => {
          e.stopPropagation()
          setIsAdding(true)
          onAddToCart()
          setTimeout(() => setIsAdding(false), 2000)
     }

     // Logic to determine if a discount is active
     const originalPrice = product.price
     const currentPrice = product.currentPrice
     const hasDiscount = currentPrice < originalPrice

     return (
          <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: index * 0.1 }}
               className="snap-start shrink-0 w-[280px] md:w-[320px] flex flex-col items-center text-center relative group"
          >
               {/* MAIN CARD CONTAINER */}
               <div
                    className="relative w-full aspect-[3/4] mb-8 rounded-t-[160px] rounded-b-3xl bg-stone-100 isolate overflow-hidden"
                    style={{
                         WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                         maskImage: "radial-gradient(white, black)"
                    }}
               >

                    {/* LAYER 1: THE IMAGE */}
                    <div className="absolute inset-0">
                         <div
                              className="w-full h-full cursor-pointer"
                              onClick={onQuickView}
                         >
                              <img
                                   src={product.image}
                                   alt={product.name}
                                   className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                              />
                         </div>
                    </div>

                    {/* LAYER 2: THE DUAL ACTION BAR */}
                    <div
                         className="absolute inset-x-0 bottom-0 z-20 h-14 flex items-stretch bg-white/80 backdrop-blur-md border-t border-white/20 divide-x divide-stone-300"
                    >
                         {/* LEFT BUTTON: PREVIEW */}
                         <button
                              onClick={(e) => {
                                   e.stopPropagation()
                                   onQuickView()
                              }}
                              className="flex-1 flex items-center justify-center gap-2 hover:bg-stone-900 hover:text-white transition-colors duration-300 group/btn outline-none focus:outline-none"
                              aria-label="Quick View"
                         >
                              <EyeIcon className="w-4 h-4" />
                              <span className="text-[10px] uppercase tracking-widest font-bold hidden md:inline-block">
                                   Preview
                              </span>
                         </button>

                         {/* RIGHT BUTTON: ADD TO CART */}
                         <button
                              onClick={handleAddToCart}
                              disabled={isAdding}
                              className={`flex-1 flex items-center justify-center gap-2 transition-colors duration-300 outline-none focus:outline-none
                                   ${isAdding
                                   ? "bg-stone-100 text-stone-400 cursor-default"
                                   : "hover:bg-stone-900 hover:text-white"
                              }`}
                              aria-label="Add to Cart"
                         >
                              <AnimatePresence mode="wait">
                                   {isAdding ? (
                                        <motion.span
                                             key="added"
                                             initial={{ opacity: 0, scale: 0.5 }}
                                             animate={{ opacity: 1, scale: 1 }}
                                             exit={{ opacity: 0, scale: 0.5 }}
                                             className="flex items-center gap-2"
                                        >
                                             <CheckIcon className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                                        </motion.span>
                                   ) : (
                                        <motion.span
                                             key="add"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             exit={{ opacity: 0 }}
                                             className="flex items-center gap-2"
                                        >
                                             <ShoppingBagIcon className="w-4 h-4" />
                                             <span className="text-[10px] uppercase tracking-widest font-bold hidden md:inline-block">
                                                  Add
                                             </span>
                                        </motion.span>
                                   )}
                              </AnimatePresence>
                         </button>
                    </div>

                    {/* LAYER 3: THE BORDER OVERLAY */}
                    <div className="absolute inset-0 border border-stone-100/50 pointer-events-none z-30"></div>

                    {/* 'New In' Tag or 'Sale' Tag */}
                    {Boolean(product.isNew) && !hasDiscount && (
                         <span className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-[9px] uppercase tracking-[0.25em] px-3 py-1.5 font-bold text-stone-900 border border-white/40 rounded-full z-20 shadow-sm pointer-events-none">
                              New In
                         </span>
                    )}

                    {hasDiscount && (
                         <span className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-50/90 backdrop-blur text-[9px] uppercase tracking-[0.25em] px-3 py-1.5 font-bold text-red-900 border border-red-100 rounded-full z-20 shadow-sm pointer-events-none">
                              Sale
                         </span>
                    )}
               </div>

               {/* TEXT CONTENT */}
               <div className="space-y-2 px-4 pointer-events-none">
                    <h3 className="font-serif text-2xl md:text-3xl text-stone-900 uppercase tracking-wide leading-none">
                         {product.name}
                    </h3>
                    <div className="flex flex-col items-center gap-1">
                         <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                              {product.scentNotes?.slice(0, 2).join(" • ")}
                         </p>

                         {/* PRICING DISPLAY LOGIC */}
                         <div className="flex items-center gap-2 mt-1">
                              {hasDiscount ? (
                                   <>
                                        <span className="text-stone-400 line-through text-xs">
                                             €{originalPrice.toFixed(2)}
                                        </span>
                                        <span className="text-red-900 font-medium tracking-wider text-sm">
                                             {product.formattedPrice}
                                        </span>
                                   </>
                              ) : (
                                   <span className="text-stone-900 font-medium tracking-wider text-sm">
                                        {product.formattedPrice}
                                   </span>
                              )}
                         </div>
                    </div>
               </div>
          </motion.div>
     )
}

export default ProductItem
