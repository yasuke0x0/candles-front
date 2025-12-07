import { Edit2, Trash2, Box, AlertCircle } from "lucide-react"
import type { IProductModel } from "@api-models"

interface ProductCardProps {
     product: IProductModel
     onEdit: (product: IProductModel) => void
     onDelete: (id: number) => void
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
     // Stock Status Logic
     const isLowStock = product.stock > 0 && product.stock <= 10
     const isOutOfStock = product.stock === 0

     // Discount Logic
     const hasDiscount = product.discounts && product.discounts.length > 0

     return (
          <div
               // 1. Make the entire card clickable for "Edit" (Mobile friendly)
               onClick={() => onEdit(product)}
               className="group relative bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
          >

               {/* IMAGE AREA */}
               <div className="aspect-[4/3] w-full bg-stone-100 relative overflow-hidden">
                    <img
                         src={product.image}
                         alt={product.name}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                         {product.isNew && (
                              <span className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-stone-900 rounded-md shadow-sm">
                                   New
                              </span>
                         )}
                         {hasDiscount && (
                              <span className="px-2 py-1 bg-stone-900/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-white rounded-md shadow-sm">
                                   Sale
                              </span>
                         )}
                         {isOutOfStock && (
                              <span className="px-2 py-1 bg-red-500/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-white rounded-md shadow-sm">
                                   Sold Out
                              </span>
                         )}
                    </div>

                    {/* Quick Actions Overlay (Desktop) */}
                    {/* FIX: Added 'pointer-events-none' (default) and 'group-hover:pointer-events-auto' */}
                    {/* This ensures the invisible buttons can't be clicked unless the overlay is actually visible */}
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                         <button
                              onClick={(e) => {
                                   e.stopPropagation()
                                   onEdit(product)
                              }}
                              className="p-3 bg-white text-stone-900 rounded-full hover:scale-110 transition-transform shadow-lg"
                              title="Edit Product"
                         >
                              <Edit2 size={18} />
                         </button>
                         <button
                              onClick={(e) => {
                                   e.stopPropagation()
                                   onDelete(product.id)
                              }}
                              className="p-3 bg-white text-red-500 rounded-full hover:scale-110 transition-transform shadow-lg"
                              title="Delete Product"
                         >
                              <Trash2 size={18} />
                         </button>
                    </div>
               </div>

               {/* CONTENT AREA */}
               <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                         <div>
                              <h3 className="font-serif text-lg text-stone-900 leading-tight">{product.name}</h3>
                              <p className="text-xs text-stone-400 mt-1 line-clamp-1">{product.scentNotes.join(" • ")}</p>
                         </div>

                         {/* Price Display Logic */}
                         <div className="flex flex-col items-end">
                              {hasDiscount ? (
                                   <>
                                        <span className="text-xs text-stone-400 line-through decoration-stone-400">
                                             €{product.price.toFixed(2)}
                                        </span>
                                        <span className="font-medium text-red-600">
                                             €{product.currentPrice.toFixed(2)}
                                        </span>
                                   </>
                              ) : (
                                   <span className="font-medium text-stone-900">
                                        €{product.price.toFixed(2)}
                                   </span>
                              )}
                         </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-stone-50 flex justify-between items-center text-xs">
                         <div className={`flex items-center gap-1.5 font-medium ${
                              isOutOfStock ? "text-red-500" : isLowStock ? "text-yellow-600" : "text-green-600"
                         }`}>
                              {isOutOfStock ? <AlertCircle size={14} /> : <Box size={14} />}
                              <span>{product.stock} in stock</span>
                         </div>
                         <span className="text-stone-300">ID: {product.id}</span>
                    </div>
               </div>

               {/* Mobile Action Bar */}
               <div className="md:hidden absolute top-3 right-3 flex gap-2">
                    <button
                         onClick={(e) => {
                              e.stopPropagation()
                              onEdit(product)
                         }}
                         className="p-2 bg-white/90 backdrop-blur rounded-full text-stone-900 shadow-sm border border-stone-100"
                    >
                         <Edit2 size={14} />
                    </button>
                    {/* Added Mobile Delete Button */}
                    <button
                         onClick={(e) => {
                              e.stopPropagation()
                              onDelete(product.id)
                         }}
                         className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-sm border border-stone-100"
                    >
                         <Trash2 size={14} />
                    </button>
               </div>
          </div>
     )
}

export default ProductCard
