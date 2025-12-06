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
          if (window.confirm("Delete this product?")) {
               await deleteMutation.mutateAsync(id)
          }
     }

     const openCreate = () => {
          setEditingProduct(null)
          setIsModalOpen(true)
     }

     return (
          <div className="space-y-8 animate-fade-in pb-20">

               {/* 1. Header & Filter */}
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                         <h1 className="font-serif text-4xl text-stone-900">Inventory</h1>
                         <p className="text-stone-500 mt-1">Manage your collection details and stock.</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-3">
                         <div className="relative flex-1 md:w-72 group">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 transition-colors" size={18} />
                              <input
                                   type="text"
                                   placeholder="Search..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all shadow-sm"
                              />
                         </div>
                         <button
                              onClick={openCreate}
                              className="bg-stone-900 text-white px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                         >
                              <Plus size={18} /> <span className="hidden sm:inline">Add Item</span>
                         </button>
                    </div>
               </div>

               {/* 2. GRID LAYOUT (Responsive) */}
               {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                         {[1,2,3,4].map(i => (
                              <div key={i} className="aspect-[4/3] bg-stone-100 rounded-2xl animate-pulse" />
                         ))}
                    </div>
               ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-stone-400 bg-stone-50/50 rounded-3xl border border-stone-100 border-dashed">
                         <Package className="w-16 h-16 mb-4 opacity-20" />
                         <p className="text-lg font-medium">No products found</p>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                         {filteredProducts.map((product) => (
                              <ProductCard
                                   key={product.id}
                                   product={product}
                                   onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
                                   onDelete={handleDelete}
                              />
                         ))}
                    </div>
               )}

               {/* 3. Mobile FAB (Bottom Right) */}
               <button
                    onClick={openCreate}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-xl shadow-stone-900/30 flex items-center justify-center z-40 active:scale-90 transition-transform"
               >
                    <Plus size={24} />
               </button>

               {/* 4. Modal */}
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
