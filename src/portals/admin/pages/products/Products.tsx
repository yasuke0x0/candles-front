import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Plus, Search, Package } from "lucide-react"
import { PRODUCTS_LIST_ENDPOINT } from "@api-endpoints"
import type { IProductModel } from "@api-models"
import ProductFormModal from "./components/ProductFormModal.tsx"
import ProductCard from "./components/ProductCard.tsx"

const Products = () => {
     const queryClient = useQueryClient()
     const [isModalOpen, setIsModalOpen] = useState(false)
     const [editingProduct, setEditingProduct] = useState<IProductModel | null>(null)
     const [searchTerm, setSearchTerm] = useState("")

     // --- DATA ---
     const { data: products = [], isLoading } = useQuery({
          queryKey: ["admin-products"],
          queryFn: async () => (await axios.get(PRODUCTS_LIST_ENDPOINT)).data,
     })

     const filteredProducts = Array.isArray(products)
          ? products.filter((p: IProductModel) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
          : []

     // --- MUTATIONS ---
     const createMutation = useMutation({
          mutationFn: (data: Partial<IProductModel>) => axios.post(PRODUCTS_LIST_ENDPOINT, data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-products"] })
               setIsModalOpen(false)
          },
     })

     const updateMutation = useMutation({
          mutationFn: (data: Partial<IProductModel>) => axios.put(`${PRODUCTS_LIST_ENDPOINT}/${editingProduct?.id}`, data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-products"] })
               setIsModalOpen(false)
               setEditingProduct(null)
          },
     })

     const deleteMutation = useMutation({
          mutationFn: (id: number) => axios.delete(`${PRODUCTS_LIST_ENDPOINT}/${id}`),
          onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
     })

     const handleSubmit = async (data: Partial<IProductModel>) => {
          if (editingProduct) {
               await updateMutation.mutateAsync(data)
          } else {
               await createMutation.mutateAsync(data)
          }
     }

     const handleDelete = async (id: number) => {
          if (window.confirm("Are you sure you want to remove this item?")) {
               await deleteMutation.mutateAsync(id)
          }
     }

     const openCreate = () => {
          setEditingProduct(null)
          setIsModalOpen(true)
     }

     return (
          // FIX: Use full height flex column layout to handle scrolling internally
          <div className="h-full flex flex-col bg-stone-50/50 font-sans relative">

               {/* --- STICKY HEADER --- */}
               <div className="w-full bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm z-30 shrink-0">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                              {/* Title Section */}
                              <div>
                                   <div className="flex items-center gap-3">
                                        <h1 className="font-serif text-2xl text-stone-900 tracking-tight">Inventory</h1>
                                        {!isLoading && (
                                             <span className="px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                                                  {filteredProducts.length} Items
                                             </span>
                                        )}
                                   </div>
                              </div>

                              {/* Actions Section */}
                              <div className="flex w-full md:w-auto gap-3">
                                   <div className="relative flex-1 md:w-64 group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 transition-colors" size={16} />
                                        <input
                                             type="text"
                                             placeholder="Search products..."
                                             value={searchTerm}
                                             onChange={(e) => setSearchTerm(e.target.value)}
                                             className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border-transparent focus:bg-white focus:border-stone-300 border rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-stone-100"
                                        />
                                   </div>
                                   <button
                                        onClick={openCreate}
                                        className="bg-stone-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                                   >
                                        <Plus size={16} /> <span className="hidden sm:inline">Add Item</span>
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>

               {/* --- SCROLLABLE CONTENT AREA --- */}
               <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-stone-200">
                    <div className="max-w-7xl mx-auto">
                         {isLoading ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                   {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="aspect-[4/3] bg-white border border-stone-100 rounded-2xl animate-pulse shadow-sm" />
                                   ))}
                              </div>
                         ) : filteredProducts.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-32 text-stone-400 bg-white rounded-3xl border border-stone-200 border-dashed">
                                   <Package className="w-12 h-12 mb-3 opacity-20" />
                                   <p className="text-sm font-medium">No products found</p>
                              </div>
                         ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                   {filteredProducts.map((product) => (
                                        <ProductCard
                                             key={product.id}
                                             product={product}
                                             onEdit={(p) => {
                                                  setEditingProduct(p)
                                                  setIsModalOpen(true)
                                             }}
                                             onDelete={handleDelete}
                                        />
                                   ))}
                              </div>
                         )}
                    </div>
               </div>

               {/* Mobile FAB */}
               <button
                    onClick={openCreate}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-xl shadow-stone-900/30 flex items-center justify-center z-40 active:scale-90 transition-transform"
               >
                    <Plus size={24} />
               </button>

               {/* Modal */}
               <ProductFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={editingProduct}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
               />
          </div>
     )
}

export default Products
