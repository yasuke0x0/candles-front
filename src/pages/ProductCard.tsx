import React from "react"
import { Plus } from "lucide-react"
import type { Product } from "../types.ts"

interface ProductCardProps {
     product: Product
     onAddToCart: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
     return (
          <div className="group cursor-pointer">
               {/* Image Container */}
               <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-6">
                    {product.isNew && <span className="absolute top-4 left-4 bg-white text-stone-900 px-3 py-1 text-[10px] font-bold tracking-widest uppercase z-10">New</span>}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110" />

                    {/* Overlay & Button */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                    <button
                         onClick={e => {
                              e.stopPropagation()
                              onAddToCart(product)
                         }}
                         className="absolute bottom-0 left-0 w-full bg-stone-900 text-white py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium text-xs uppercase tracking-widest hover:bg-stone-800 flex items-center justify-center gap-2"
                    >
                         <Plus size={16} /> Add to Cart
                    </button>
               </div>

               {/* Details */}
               <div className="flex flex-col items-center text-center space-y-2">
                    <h3 className="font-serif text-xl text-stone-900 group-hover:text-stone-600 transition-colors">{product.name}</h3>
                    <p className="text-xs text-stone-500 uppercase tracking-wide">{product.scentNotes.join(" • ")}</p>
                    <span className="font-sans text-sm font-medium text-stone-900 pt-1">${product.price.toFixed(2)}</span>
               </div>
          </div>
     )
}

export default ProductCard
