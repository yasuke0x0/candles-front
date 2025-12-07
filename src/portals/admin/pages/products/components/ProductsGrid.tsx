import { AnimatePresence } from "framer-motion"
import { Archive, Package } from "lucide-react"
import ProductCard from "../components/ProductCard.tsx"
import type { IProductModel } from "@api-models"

interface ProductsGridProps {
     isLoading: boolean
     products: IProductModel[]
     viewStatus: "ACTIVE" | "ARCHIVED"
     activeFiltersCount: number
     onClearFilters: () => void
     onEdit: (product: IProductModel) => void
     onArchive: (id: number) => void
}

const ProductsGrid = ({ isLoading, products, viewStatus, activeFiltersCount, onClearFilters, onEdit, onArchive }: ProductsGridProps) => {
     if (isLoading) {
          return (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                         <ProductSkeleton key={i} />
                    ))}
               </div>
          )
     }

     if (products.length === 0) {
          return (
               <div className="flex flex-col items-center justify-center py-32 text-stone-400 bg-white rounded-3xl border border-stone-200 border-dashed">
                    {viewStatus === "ARCHIVED" ? <Archive className="w-12 h-12 mb-3 opacity-20" /> : <Package className="w-12 h-12 mb-3 opacity-20" />}
                    <p className="text-sm font-medium">No {viewStatus.toLowerCase()} products found</p>
                    {activeFiltersCount > 0 && (
                         <button onClick={onClearFilters} className="mt-4 text-xs font-bold text-stone-900 underline">
                              Clear filters
                         </button>
                    )}
               </div>
          )
     }

     return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
               <AnimatePresence mode="popLayout">
                    {products.map((product: IProductModel) => (
                         <ProductCard key={product.id} product={product} isArchived={viewStatus === "ARCHIVED"} onEdit={onEdit} onArchive={onArchive} />
                    ))}
               </AnimatePresence>
          </div>
     )
}

// --- Internal Skeleton Component ---
const ProductSkeleton = () => (
     <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden flex flex-col h-full shadow-sm">
          <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
               <div className="absolute inset-0 flex items-center justify-center opacity-10 text-stone-300">
                    <Package size={40} />
               </div>
          </div>
          <div className="p-5 flex-1 flex flex-col space-y-4">
               <div className="space-y-2">
                    <div className="h-5 bg-stone-100 rounded-md w-3/4 animate-pulse" />
                    <div className="h-3 bg-stone-50 rounded-md w-1/2 animate-pulse" />
               </div>
               <div className="mt-auto pt-4 border-t border-stone-50 flex justify-between items-center">
                    <div className="h-3 bg-stone-100 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-stone-100 rounded w-1/4 animate-pulse" />
               </div>
          </div>
     </div>
)

export default ProductsGrid
