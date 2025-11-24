import React, { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Product } from "../types"
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline"

interface ProductListProps {
     products: Product[]
     addToCart: (product: Product) => void
}

const ProductList: React.FC<ProductListProps> = ({ products, addToCart }) => {
     const scrollRef = useRef<HTMLDivElement>(null)

     const scroll = (direction: "left" | "right") => {
          if (scrollRef.current) {
               // Scroll amount matches card width (320px) + gap (~30px)
               const scrollAmount = 350
               scrollRef.current.scrollBy({
                    left: direction === "left" ? -scrollAmount : scrollAmount,
                    behavior: "smooth",
               })
          }
     }

     return (
          <section className="py-24 bg-white relative">
               <div className="max-w-[1600px] mx-auto px-12 md:px-24 relative group/section">
                    {/* --- HEADER --- */}
                    <div className="relative text-center mb-20 px-6">
                         <div className="flex items-center justify-center gap-4 mb-6">
                              <span className="h-px w-12 bg-stone-300"></span>
                              <span className="text-stone-500 uppercase tracking-[0.3em] text-[10px] font-bold">The Wax Atelier</span>
                              <span className="h-px w-12 bg-stone-300"></span>
                         </div>

                         <h2 className="font-serif text-5xl md:text-7xl text-stone-900 leading-none mb-6">
                              Sculpted <span className="italic font-light text-stone-400">Illuminations</span>
                         </h2>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                         onClick={() => scroll("left")}
                         className="absolute left-4 top-[55%] -translate-y-1/2 z-20 p-4 rounded-full text-stone-300 hover:text-stone-900 hover:bg-stone-50 transition-all duration-300 hidden md:block"
                         aria-label="Scroll Left"
                    >
                         <ChevronLeftIcon className="w-12 h-12 font-thin" strokeWidth={0.8} />
                    </button>

                    <button
                         onClick={() => scroll("right")}
                         className="absolute right-4 top-[55%] -translate-y-1/2 z-20 p-4 rounded-full text-stone-300 hover:text-stone-900 hover:bg-stone-50 transition-all duration-300 hidden md:block"
                         aria-label="Scroll Right"
                    >
                         <ChevronRightIcon className="w-12 h-12 font-thin" strokeWidth={0.8} />
                    </button>

                    {/* Scrollable Container */}
                    <div
                         ref={scrollRef}
                         className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-10 pb-10 scrollbar-hide px-2"
                         style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                         {products.map((product, index) => (
                              <CarouselItem key={product.id} product={product} index={index} onAddToCart={() => addToCart(product)} />
                         ))}
                    </div>
               </div>

               <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
          </section>
     )
}

const CarouselItem = ({ product, index, onAddToCart }: { product: Product; index: number; onAddToCart: () => void }) => {
     const [isAdding, setIsAdding] = useState(false)

     const handleAddToCart = (e: React.MouseEvent) => {
          e.stopPropagation()
          setIsAdding(true)
          onAddToCart()
          setTimeout(() => setIsAdding(false), 2000)
     }

     return (
          <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: index * 0.1 }}
               className="snap-start shrink-0 w-[280px] md:w-[320px] flex flex-col items-center text-center relative"
          >
               {/* WRAPPER: Defines the dimensions.
                The 'group' class is here so hovering anywhere triggers the image zoom.
            */}
               <div className="relative w-full aspect-[3/4] mb-8 cursor-pointer group">
                    {/* --- LAYER 1: THE IMAGE (Background) --- */}
                    <div
                         className="absolute inset-0 w-full h-full rounded-t-[160px] rounded-b-3xl overflow-hidden isolate z-0 border border-stone-100/50"
                         style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                    >
                         <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                         />
                    </div>

                    {/* --- LAYER 2: THE UI (Foreground) --- */}
                    <div className="absolute inset-x-0 bottom-0 z-10 rounded-b-3xl overflow-hidden">
                         <button
                              onClick={handleAddToCart}
                              disabled={isAdding}
                              className={`w-full py-4 text-xs uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-colors duration-300 border-t border-white/20
                            ${isAdding ? "bg-stone-800 text-white" : "bg-white/80 backdrop-blur-md text-stone-900 group-hover:bg-stone-900 group-hover:text-white"}`}
                         >
                              <AnimatePresence mode="wait">
                                   {isAdding ? (
                                        <motion.span
                                             key="added"
                                             initial={{ opacity: 0, y: 5 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             exit={{ opacity: 0, y: -5 }}
                                             className="flex items-center gap-2"
                                        >
                                             <CheckIcon className="w-4 h-4" /> Added
                                        </motion.span>
                                   ) : (
                                        <motion.span
                                             key="add"
                                             initial={{ opacity: 0, y: 5 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             exit={{ opacity: 0, y: -5 }}
                                             className="flex items-center gap-2"
                                        >
                                             <PlusIcon className="w-3 h-3 opacity-70" strokeWidth={2} />
                                             Add to Cart
                                        </motion.span>
                                   )}
                              </AnimatePresence>
                         </button>
                    </div>

                    {/* --- LAYER 3: THE BADGE --- */}
                    {product.isNew && (
                         <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur text-[9px] uppercase tracking-[0.25em] px-3 py-1.5 font-bold text-stone-900 border border-white/40 rounded-full z-20">
                              New In
                         </span>
                    )}
               </div>

               {/* TEXT CONTENT */}
               <div className="space-y-3 px-4">
                    <h3 className="font-serif text-2xl md:text-3xl text-stone-900 uppercase tracking-wide">{product.name}</h3>
                    <p className="text-sm text-stone-500 font-light tracking-wide">{product.scentNotes.join(" - ")}</p>
                    <p className="text-stone-900 font-medium tracking-wider text-sm">€{product.price} EUR</p>
               </div>
          </motion.div>
     )
}

export default ProductList
