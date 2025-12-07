import { useEffect, useState } from "react"
import axios from "axios"
import {
     Edit2,
     Loader2,
     Plus,
     Search,
     Ticket,
     Trash2,
     Calendar,
     Hash,
     DollarSign,
     Percent,
     AlertCircle
} from "lucide-react"
import type { ICoupon } from "@api-models"
import CouponFormModal from "@portals/admin/pages/coupons/components/CouponFormModal"
import { COUPONS_ENDPOINT } from "@api-endpoints"

const Coupons = () => {
     const [coupons, setCoupons] = useState<ICoupon[]>([])
     const [isLoading, setIsLoading] = useState(true)
     const [isModalOpen, setIsModalOpen] = useState(false)
     const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null)
     const [isSubmitting, setIsSubmitting] = useState(false)
     const [searchTerm, setSearchTerm] = useState("")

     // --- API INTERACTIONS ---

     const fetchCoupons = async () => {
          try {
               const res = await axios.get(COUPONS_ENDPOINT)
               setCoupons(res.data)
          } catch (error) {
               console.error("Failed to fetch coupons", error)
          } finally {
               setIsLoading(false)
          }
     }

     useEffect(() => {
          fetchCoupons()
     }, [])

     const handleCreate = () => {
          setEditingCoupon(null)
          setIsModalOpen(true)
     }

     const handleEdit = (coupon: ICoupon) => {
          setEditingCoupon(coupon)
          setIsModalOpen(true)
     }

     const handleDelete = async (id: number) => {
          if (!window.confirm("Are you sure? This action cannot be undone.")) return

          // Optimistic update for speed
          const previousCoupons = [...coupons]
          setCoupons(prev => prev.filter(c => c.id !== id))

          try {
               await axios.delete(`${COUPONS_ENDPOINT}/${id}`)
          } catch (error) {
               console.error(error)
               // Revert if failed
               setCoupons(previousCoupons)
               alert("Failed to delete coupon")
          }
     }

     const handleSubmit = async (data: Partial<ICoupon>) => {
          setIsSubmitting(true)
          try {
               if (editingCoupon) {
                    const res = await axios.put(`${COUPONS_ENDPOINT}/${editingCoupon.id}`, data)
                    setCoupons(prev => prev.map(c => (c.id === editingCoupon.id ? res.data : c)))
               } else {
                    const res = await axios.post(COUPONS_ENDPOINT, data)
                    setCoupons(prev => [res.data, ...prev])
               }
               setIsModalOpen(false)
          } catch (error) {
               console.error(error)
               alert("Failed to save coupon")
          } finally {
               setIsSubmitting(false)
          }
     }

     // --- FILTERING ---
     const filteredCoupons = coupons.filter(c =>
          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchTerm.toLowerCase())
     )

     return (
          <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans relative">
               <div className="max-w-7xl mx-auto space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <div>
                              <h1 className="text-3xl font-serif text-stone-900 tracking-tight">Coupons</h1>
                              <p className="text-stone-500 mt-1 text-sm font-medium">Manage discount codes and campaigns</p>
                         </div>
                         <button
                              onClick={handleCreate}
                              className="hidden md:flex bg-stone-900 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-stone-800 transition-all active:scale-95 items-center justify-center gap-2 shadow-lg shadow-stone-900/10"
                         >
                              <Plus size={16} />
                              <span>New Coupon</span>
                         </button>
                    </div>

                    {/* SEARCH */}
                    <div className="relative group">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 transition-colors">
                              <Search size={18} />
                         </div>
                         <input
                              type="text"
                              placeholder="Search by code or description..."
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all shadow-sm placeholder:text-stone-300 text-sm font-medium"
                         />
                    </div>

                    {/* CONTENT AREA */}
                    {isLoading ? (
                         <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
                              <Loader2 className="animate-spin" size={32} />
                              <span className="text-xs uppercase tracking-widest font-bold">Loading Inventory...</span>
                         </div>
                    ) : filteredCoupons.length === 0 ? (
                         <div className="bg-white border border-stone-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
                              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                                   <Ticket size={32} />
                              </div>
                              <div>
                                   <h3 className="text-lg font-serif text-stone-900">No coupons found</h3>
                                   <p className="text-stone-400 text-sm mt-1">Try adjusting your search or create a new one.</p>
                              </div>
                         </div>
                    ) : (
                         <>
                              {/* MOBILE VIEW (Cards) - Visible on < md */}
                              <div className="grid grid-cols-1 gap-4 md:hidden pb-20">
                                   {filteredCoupons.map((coupon) => (
                                        <MobileCouponCard
                                             key={coupon.id}
                                             coupon={coupon}
                                             onEdit={handleEdit}
                                             onDelete={handleDelete}
                                        />
                                   ))}
                              </div>

                              {/* DESKTOP VIEW (Table) - Visible on >= md */}
                              <div className="hidden md:block bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
                                   <table className="w-full text-left border-collapse">
                                        <thead className="bg-stone-50/80 backdrop-blur border-b border-stone-100">
                                        <tr>
                                             {["Status", "Code", "Discount", "Usage", "Expires", ""].map((header, i) => (
                                                  <th key={i} className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 ${i === 5 ? 'text-right' : ''}`}>
                                                       {header}
                                                  </th>
                                             ))}
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-50">
                                        {filteredCoupons.map((coupon) => (
                                             <DesktopCouponRow
                                                  key={coupon.id}
                                                  coupon={coupon}
                                                  onEdit={handleEdit}
                                                  onDelete={handleDelete}
                                             />
                                        ))}
                                        </tbody>
                                   </table>
                              </div>
                         </>
                    )}

                    {/* FLOATING ACTION BUTTON (Mobile Only) */}
                    <button
                         onClick={handleCreate}
                         className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
                    >
                         <Plus size={24} />
                    </button>

                    {/* MODAL */}
                    <CouponFormModal
                         isOpen={isModalOpen}
                         onClose={() => setIsModalOpen(false)}
                         onSubmit={handleSubmit}
                         initialData={editingCoupon}
                         isSubmitting={isSubmitting}
                    />
               </div>
          </div>
     )
}

// --- SUB COMPONENTS FOR CLEANER CODE ---

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
     <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
          isActive
               ? "bg-green-50 text-green-700 border-green-200"
               : "bg-stone-100 text-stone-400 border-stone-200"
     }`}>
          {isActive ? "Active" : "Inactive"}
     </span>
)

const DesktopCouponRow = ({ coupon, onEdit, onDelete }: { coupon: ICoupon, onEdit: any, onDelete: any }) => (
     <tr className="hover:bg-stone-50/80 transition-colors group">
          <td className="px-6 py-4">
               <StatusBadge isActive={coupon.isActive} />
          </td>
          <td className="px-6 py-4">
               <div className="flex flex-col">
                    <span className="font-mono font-bold text-stone-900 text-sm tracking-tight">{coupon.code}</span>
                    <span className="text-xs text-stone-400 truncate max-w-[200px]">{coupon.description || "—"}</span>
               </div>
          </td>
          <td className="px-6 py-4">
               <div className="flex items-center gap-2 font-medium text-stone-900">
                    {coupon.type === "PERCENTAGE" ? <Percent size={14} className="text-stone-400" /> : <DollarSign size={14} className="text-stone-400" />}
                    <span>{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `€${coupon.value.toFixed(2)}`}</span>
               </div>
          </td>
          <td className="px-6 py-4">
               <div className="flex flex-col gap-1 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                         <Hash size={12} />
                         <span>{coupon.maxUses ? coupon.maxUses : "Unlimited"}</span>
                    </div>
                    {coupon.minOrderAmount !== null && coupon.minOrderAmount > 0 && (
                         <div className="flex items-center gap-1.5 text-stone-400">
                              <AlertCircle size={12} />
                              <span>Min €{coupon.minOrderAmount}</span>
                         </div>
                    )}
               </div>
          </td>
          <td className="px-6 py-4 text-xs font-mono text-stone-500">
               {coupon.endsAt ? new Date(coupon.endsAt).toLocaleDateString() : <span className="text-stone-300">—</span>}
          </td>
          <td className="px-6 py-4 text-right">
               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                         onClick={() => onEdit(coupon)}
                         className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                         title="Edit"
                    >
                         <Edit2 size={16} />
                    </button>
                    <button
                         onClick={() => onDelete(coupon.id)}
                         className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                         title="Delete"
                    >
                         <Trash2 size={16} />
                    </button>
               </div>
          </td>
     </tr>
)

const MobileCouponCard = ({ coupon, onEdit, onDelete }: { coupon: ICoupon, onEdit: any, onDelete: any }) => (
     <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          {/* Top Row: Code and Status */}
          <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-900">
                         <Ticket size={18} />
                    </div>
                    <div>
                         <h3 className="font-mono font-bold text-stone-900 text-lg tracking-tight">{coupon.code}</h3>
                         <StatusBadge isActive={coupon.isActive} />
                    </div>
               </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-stone-50">
               <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest block mb-1">Value</span>
                    <span className="font-serif text-xl text-stone-900">
                         {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `€${coupon.value.toFixed(2)}`}
                    </span>
               </div>
               <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest block mb-1">Expires</span>
                    <div className="flex items-center gap-1.5 text-sm text-stone-600">
                         <Calendar size={14} />
                         {coupon.endsAt ? new Date(coupon.endsAt).toLocaleDateString() : "Never"}
                    </div>
               </div>
               <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest block mb-1">Limits</span>
                    <div className="flex gap-4 text-xs text-stone-500">
                         <span>{coupon.maxUses ? `${coupon.maxUses} uses max` : "Unlimited uses"}</span>
                         {coupon.minOrderAmount !== null && coupon.minOrderAmount > 0 && <span>• Min order €{coupon.minOrderAmount}</span>}
                    </div>
               </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-3">
               <button
                    onClick={() => onEdit(coupon)}
                    className="flex-1 py-3 bg-stone-50 text-stone-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
               >
                    <Edit2 size={14} /> Edit
               </button>
               <button
                    onClick={() => onDelete(coupon.id)}
                    className="flex-1 py-3 bg-white border border-stone-200 text-red-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors flex items-center justify-center gap-2"
               >
                    <Trash2 size={14} /> Delete
               </button>
          </div>
     </div>
)

export default Coupons
