import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Plus } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { ADMIN_PRODUCTS_LIST_ENDPOINT, PRODUCT_ARCHIVE_ENDPOINT, PRODUCT_RESTORE_ENDPOINT } from "@api-endpoints"
import type { IProductModel } from "@api-models"

// Components
import ProductFormModal from "./components/ProductFormModal.tsx"
import ConfirmationModal from "./components/ConfirmationModal.tsx"
import ProductsHeader from "./components/ProductsHeader.tsx"
import ProductsGrid from "./components/ProductsGrid.tsx"
import ProductsMobileFilter from "./components/ProductsMobileFilter.tsx"
import { ProductToast } from "./components/ProductsToast.tsx"

// --- UTILS ---
function useDebounce<T>(value: T, delay: number): T {
     const [debouncedValue, setDebouncedValue] = useState(value)
     useEffect(() => {
          const handler = setTimeout(() => setDebouncedValue(value), delay)
          return () => clearTimeout(handler)
     }, [value, delay])
     return debouncedValue
}

const Products = () => {
     const queryClient = useQueryClient()
     const [isModalOpen, setIsModalOpen] = useState(false)
     const [editingProduct, setEditingProduct] = useState<IProductModel | null>(null)

     // Confirmation Modal State
     const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number | null; action: "ARCHIVE" | "RESTORE" }>({
          isOpen: false,
          id: null,
          action: "ARCHIVE",
     })

     // Toast State
     const [toast, setToast] = useState<string | null>(null)

     // --- FILTER STATES ---
     const [searchTerm, setSearchTerm] = useState("")
     const [viewStatus, setViewStatus] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE")
     const [showMobileFilterModal, setShowMobileFilterModal] = useState(false)

     const debouncedSearch = useDebounce(searchTerm, 500)

     // Auto-hide toast
     useEffect(() => {
          if (toast) {
               const timer = setTimeout(() => setToast(null), 3000)
               return () => clearTimeout(timer)
          }
     }, [toast])

     const activeFiltersCount = [viewStatus !== "ACTIVE", searchTerm !== ""].filter(Boolean).length

     const clearFilters = () => {
          setViewStatus("ACTIVE")
          setSearchTerm("")
     }

     // --- SERVER SIDE DATA FETCHING ---
     const { data: products = [], isLoading } = useQuery({
          queryKey: ["admin-products", viewStatus, debouncedSearch],
          queryFn: async () => {
               const [res] = await Promise.all([
                    axios.get(ADMIN_PRODUCTS_LIST_ENDPOINT, {
                         params: {
                              status: viewStatus,
                              search: debouncedSearch,
                         },
                    }),
                    new Promise(resolve => setTimeout(resolve, 300)),
               ])
               return res.data.data || res.data
          },
     })

     // --- MUTATIONS ---
     const showToast = (msg: string) => setToast(msg)

     const createMutation = useMutation({
          mutationFn: (data: Partial<IProductModel>) => axios.post(ADMIN_PRODUCTS_LIST_ENDPOINT.replace("/admin", ""), data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-products"] })
               setIsModalOpen(false)
               showToast("Product created successfully")
          },
     })

     const updateMutation = useMutation({
          mutationFn: (data: Partial<IProductModel>) => axios.put(`${ADMIN_PRODUCTS_LIST_ENDPOINT.replace("/admin/products", "/products")}/${editingProduct?.id}`, data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-products"] })
               setIsModalOpen(false)
               setEditingProduct(null)
               showToast("Product updated successfully")
          },
     })

     const archiveMutation = useMutation({
          mutationFn: (id: number) => axios.patch(PRODUCT_ARCHIVE_ENDPOINT(id)),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-products"] })
               showToast("Product archived")
          },
     })

     const restoreMutation = useMutation({
          mutationFn: (id: number) => axios.patch(PRODUCT_RESTORE_ENDPOINT(id)),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-products"] })
               showToast("Product restored to shop")
          },
     })

     const handleSubmit = async (data: Partial<IProductModel>) => {
          if (editingProduct) {
               await updateMutation.mutateAsync(data)
          } else {
               await createMutation.mutateAsync(data)
          }
     }

     // Trigger Confirmation Modal
     const handleStatusChangeClick = (id: number) => {
          setConfirmModal({
               isOpen: true,
               id,
               action: viewStatus === "ACTIVE" ? "ARCHIVE" : "RESTORE",
          })
     }

     // Actual Action Execution
     const confirmStatusChange = async () => {
          if (confirmModal.id) {
               if (confirmModal.action === "ARCHIVE") {
                    await archiveMutation.mutateAsync(confirmModal.id)
               } else {
                    await restoreMutation.mutateAsync(confirmModal.id)
               }
          }
     }

     const openCreate = () => {
          setEditingProduct(null)
          setIsModalOpen(true)
     }

     return (
          <div className="h-full flex flex-col bg-stone-50/50 font-sans relative">
               <AnimatePresence>{toast && <ProductToast message={toast} />}</AnimatePresence>

               <ProductsHeader
                    productsCount={products.length}
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    viewStatus={viewStatus}
                    setViewStatus={setViewStatus}
                    activeFiltersCount={activeFiltersCount}
                    setShowMobileFilterModal={setShowMobileFilterModal}
                    onOpenCreate={openCreate}
               />

               <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-stone-200">
                    <div className="max-w-7xl mx-auto">
                         <ProductsGrid
                              isLoading={isLoading}
                              products={products}
                              viewStatus={viewStatus}
                              activeFiltersCount={activeFiltersCount}
                              onClearFilters={clearFilters}
                              onEdit={p => {
                                   setEditingProduct(p)
                                   setIsModalOpen(true)
                              }}
                              onArchive={handleStatusChangeClick}
                         />
                    </div>
               </div>

               <ProductsMobileFilter
                    isOpen={showMobileFilterModal}
                    onClose={() => setShowMobileFilterModal(false)}
                    activeFiltersCount={activeFiltersCount}
                    onClearFilters={clearFilters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    viewStatus={viewStatus}
                    setViewStatus={setViewStatus}
               />

               {/* Mobile FAB (Create) */}
               <button
                    onClick={openCreate}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-xl shadow-stone-900/30 flex items-center justify-center z-40 active:scale-90 transition-transform"
               >
                    <Plus size={24} />
               </button>

               <ProductFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={editingProduct}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                    onArchive={handleStatusChangeClick}
               />

               <ConfirmationModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                    onConfirm={confirmStatusChange}
                    actionType={confirmModal.action === "ARCHIVE" ? "ARCHIVE" : "RESTORE"}
                    title={confirmModal.action === "ARCHIVE" ? "Archive Product" : "Restore Product"}
                    description={
                         confirmModal.action === "ARCHIVE"
                              ? "This product will be hidden from your store immediately. You can restore it anytime from the Archived tab."
                              : "This product will be visible in your store immediately."
                    }
               />
          </div>
     )
}

export default Products
