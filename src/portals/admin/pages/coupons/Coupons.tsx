import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Plus } from "lucide-react"

import { COUPONS_ENDPOINT } from "@api-endpoints"
import type { ICoupon } from "@api-models"

// Sub-components
import CouponsHeader from "./components/CouponsHeader"
import CouponsTable from "./components/CouponsTable"
import CouponsMobileList from "./components/CouponsMobileList"
import CouponsMobileFilter from "./components/CouponsMobileFilter"
import CouponFormModal from "@portals/admin/pages/coupons/components/CouponFormModal"

// --- UTILS ---
function useDebounce<T>(value: T, delay: number): T {
     const [debouncedValue, setDebouncedValue] = useState(value)
     useEffect(() => {
          const handler = setTimeout(() => setDebouncedValue(value), delay)
          return () => clearTimeout(handler)
     }, [value, delay])
     return debouncedValue
}

// --- TOAST ---
const Toast = ({ message }: { message: string }) => (
     <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
     >
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-bold tracking-wide">{message}</span>
     </motion.div>
)

const Coupons = () => {
     const queryClient = useQueryClient()

     // UI State
     const [isModalOpen, setIsModalOpen] = useState(false)
     const [showFilterModal, setShowFilterModal] = useState(false)
     const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null)
     const [toast, setToast] = useState<string | null>(null)

     // Filter State
     const [searchTerm, setSearchTerm] = useState("")
     const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL")

     const debouncedSearch = useDebounce(searchTerm, 300)

     // Auto-hide toast
     useEffect(() => {
          if (toast) {
               const timer = setTimeout(() => setToast(null), 3000)
               return () => clearTimeout(timer)
          }
     }, [toast])

     const showToast = (msg: string) => setToast(msg)

     // --- DATA FETCHING ---
     const { data: coupons = [], isLoading } = useQuery({
          queryKey: ["admin-coupons", statusFilter, debouncedSearch],
          queryFn: async () => {
               const params: any = {}
               if (debouncedSearch) params.search = debouncedSearch
               if (statusFilter !== "ALL") params.status = statusFilter === "ACTIVE" ? "true" : "false"

               const [res] = await Promise.all([axios.get(COUPONS_ENDPOINT, { params }), new Promise(resolve => setTimeout(resolve, 500))])

               return res.data
          },
     })

     // --- MUTATIONS ---
     const createMutation = useMutation({
          mutationFn: (data: Partial<ICoupon>) => axios.post(COUPONS_ENDPOINT, data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-coupons"] })
               setIsModalOpen(false)
               showToast("Coupon created successfully")
          },
     })

     const updateMutation = useMutation({
          mutationFn: (data: Partial<ICoupon>) => axios.put(`${COUPONS_ENDPOINT}/${editingCoupon?.id}`, data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-coupons"] })
               setIsModalOpen(false)
               setEditingCoupon(null)
               showToast("Coupon updated successfully")
          },
     })

     const deleteMutation = useMutation({
          mutationFn: (id: number) => axios.delete(`${COUPONS_ENDPOINT}/${id}`),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-coupons"] })
               showToast("Coupon deleted permanently")
          },
     })

     const toggleStatusMutation = useMutation({
          mutationFn: async (coupon: ICoupon) => {
               const endpoint = coupon.isActive ? `${COUPONS_ENDPOINT}/${coupon.id}/disable` : `${COUPONS_ENDPOINT}/${coupon.id}/enable`
               return axios.patch(endpoint)
          },
          onSuccess: (_, variables) => {
               queryClient.invalidateQueries({ queryKey: ["admin-coupons"] })
               showToast(variables.isActive ? "Coupon archived" : "Coupon restored")
               if (isModalOpen && editingCoupon?.id === variables.id) {
                    setIsModalOpen(false)
               }
          },
     })

     const handleSubmit = async (data: Partial<ICoupon>) => {
          if (editingCoupon) {
               await updateMutation.mutateAsync(data)
          } else {
               await createMutation.mutateAsync(data)
          }
     }

     const handleDelete = async (id: number) => {
          if (window.confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
               await deleteMutation.mutateAsync(id)
          }
     }

     const handleArchive = async (coupon: ICoupon) => {
          await toggleStatusMutation.mutateAsync(coupon)
     }

     const handleCreate = () => {
          setEditingCoupon(null)
          setIsModalOpen(true)
     }

     const handleEdit = (coupon: ICoupon) => {
          setEditingCoupon(coupon)
          setIsModalOpen(true)
     }

     const activeFiltersCount = [searchTerm !== "", statusFilter !== "ALL"].filter(Boolean).length

     const handleClearFilters = () => {
          setSearchTerm("")
          setStatusFilter("ALL")
     }

     return (
          <div className="h-full flex flex-col bg-stone-50/50 font-sans relative">
               <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>

               {/* HEADER */}
               <CouponsHeader
                    totalCoupons={coupons.length}
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onOpenCreate={handleCreate}
                    onOpenFilter={() => setShowFilterModal(true)}
                    activeFiltersCount={activeFiltersCount}
                    onClearFilters={handleClearFilters}
               />

               {/* SCROLLABLE CONTENT AREA */}
               <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-stone-200">
                    <div className="max-w-7xl mx-auto space-y-6">
                         <CouponsTable
                              coupons={coupons}
                              isLoading={isLoading}
                              onEdit={handleEdit}
                              onArchive={handleArchive}
                              onDelete={handleDelete} // Added prop
                         />

                         <CouponsMobileList
                              coupons={coupons}
                              isLoading={isLoading}
                              onEdit={handleEdit}
                              onArchive={handleArchive}
                              onDelete={handleDelete} // Added prop
                         />
                    </div>
               </div>

               {/* MOBILE FILTER MODAL */}
               <CouponsMobileFilter
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    activeFiltersCount={activeFiltersCount}
                    onClearFilters={handleClearFilters}
               />

               {/* MOBILE FAB */}
               <button
                    onClick={handleCreate}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-xl shadow-stone-900/30 flex items-center justify-center z-40 active:scale-90 transition-transform"
               >
                    <Plus size={24} />
               </button>

               {/* FORM MODAL */}
               <CouponFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={editingCoupon}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                    onArchive={handleArchive}
               />
          </div>
     )
}

export default Coupons
