import { useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { IProductModel } from "@models"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import useCart from "@pages/cart/core/useCart.tsx"
import axios from "axios"
import { PRODUCTS_LIST_ENDPOINT } from "@endpoints"
import ProductItem from "@pages/landing/components/productList/ProductItem.tsx"
import ProductModal from "@pages/landing/components/productList/ProductModal.tsx"

// --- FETCHER ---
const fetchProducts = async (): Promise<IProductModel[]> => {
     const response = await axios.get(PRODUCTS_LIST_ENDPOINT)
     return response.data
}

const ProductList = () => {
     const { addToCart } = useCart()
     const scrollRef = useRef<HTMLDivElement>(null)
     const [selectedProduct, setSelectedProduct] = useState<IProductModel | null>(null)

     const {
          data: products = [],
          isLoading,
          isError,
          error,
          refetch,
     } = useQuery({
          queryKey: ["products"],
          queryFn: fetchProducts,
          retry: 1,
          refetchOnWindowFocus: false,
     })

     const scroll = (direction: "left" | "right") => {
          if (scrollRef.current) {
               const scrollAmount = 350
               scrollRef.current.scrollBy({
                    left: direction === "left" ? -scrollAmount : scrollAmount,
                    behavior: "smooth",
               })
          }
     }

     return (
          <section id={"shop"} className="py-24 bg-white relative">
               <div className="max-w-[1600px] mx-auto px-4 md:px-24 relative group/section">
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

                    {/* --- ERROR / LOADING / LIST --- */}
                    {isError ? (
                         <div className="flex justify-center items-center h-[200px]">
                              <div className="text-center p-8 border border-red-100 bg-red-50 rounded-lg">
                                   <p className="text-stone-500 font-serif mb-2">{error instanceof Error ? error.message : "Unable to load collection."}</p>
                                   <button onClick={() => refetch()} className="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 underline transition-colors">
                                        Try Again
                                   </button>
                              </div>
                         </div>
                    ) : isLoading ? (
                         <div className="flex justify-center items-center h-[400px]">
                              <div className="animate-pulse flex flex-col items-center">
                                   <div className="h-8 w-8 bg-stone-200 rounded-full mb-4"></div>
                                   <span className="text-stone-400 text-sm tracking-widest uppercase">Loading Collection...</span>
                              </div>
                         </div>
                    ) : (
                         <>
                              {/* Navigation Arrows */}
                              <button
                                   onClick={() => scroll("left")}
                                   className="absolute left-4 top-[55%] -translate-y-1/2 z-20 p-4 rounded-full text-stone-300 hover:text-stone-900 hover:bg-stone-50 transition-all duration-300 hidden md:block"
                              >
                                   <ChevronLeftIcon className="w-12 h-12 font-thin" strokeWidth={0.8} />
                              </button>
                              <button
                                   onClick={() => scroll("right")}
                                   className="absolute right-4 top-[55%] -translate-y-1/2 z-20 p-4 rounded-full text-stone-300 hover:text-stone-900 hover:bg-stone-50 transition-all duration-300 hidden md:block"
                              >
                                   <ChevronRightIcon className="w-12 h-12 font-thin" strokeWidth={0.8} />
                              </button>

                              {/* Products Row */}
                              <div
                                   ref={scrollRef}
                                   className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-10 pb-10 scrollbar-hide px-2"
                                   style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                              >
                                   {products.map((product, index) => (
                                        <ProductItem
                                             key={product.id}
                                             product={product}
                                             index={index}
                                             onAddToCart={() => addToCart(product)}
                                             onQuickView={() => setSelectedProduct(product)}
                                        />
                                   ))}
                              </div>
                         </>
                    )}
               </div>

               {/* --- THE LUXURY MODAL --- */}
               <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={quantity => selectedProduct && addToCart(selectedProduct, quantity)} />

               <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          </section>
     )
}

export default ProductList
