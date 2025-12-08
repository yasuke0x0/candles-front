import { AlertCircle, Archive, Edit2, Hash, RotateCcw, Ticket, Trash2 } from "lucide-react"
import type { ICoupon } from "@api-models"

interface CouponsTableProps {
     coupons: ICoupon[]
     isLoading: boolean
     onEdit: (coupon: ICoupon) => void
     onArchive: (coupon: ICoupon) => void
     onDelete: (id: number) => void
}

const CouponsTable = ({ coupons, isLoading, onEdit, onArchive, onDelete }: CouponsTableProps) => {
     if (isLoading) return <TableSkeleton />

     if (coupons.length === 0) return <EmptyState />

     return (
          <div className="hidden md:block bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left border-collapse">
                    <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                         {["Status", "Code", "Discount", "Limits", "Expires", ""].map((header, i) => (
                              <th key={i} className={`px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 ${i === 5 ? "text-right" : ""}`}>
                                   {header}
                              </th>
                         ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                    {coupons.map(coupon => (
                         <tr key={coupon.id} onClick={() => onEdit(coupon)} className="group hover:bg-stone-50/80 transition-colors cursor-pointer">
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
                                   <div className="flex items-center gap-2 font-medium text-stone-900 bg-stone-50 inline-flex px-2 py-1 rounded-md border border-stone-100">
                                        <span className="text-sm">{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `${coupon.value.toFixed(2)}`}</span>
                                   </div>
                              </td>
                              <td className="px-6 py-4">
                                   <div className="flex flex-col gap-1 text-xs text-stone-500">
                                        <div className="flex items-center gap-1.5">
                                             <Hash size={12} />
                                             <span>{coupon.maxUses ? `${coupon.maxUses} max` : "Unlimited"}</span>
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
                                   {coupon.endsAt ? new Date(coupon.endsAt).toLocaleDateString() : <span className="text-stone-300">Never</span>}
                              </td>
                              <td className="px-6 py-4 text-right">
                                   <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Edit */}
                                        <button
                                             onClick={e => {
                                                  e.stopPropagation()
                                                  onEdit(coupon)
                                             }}
                                             className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                                             title="Edit"
                                        >
                                             <Edit2 size={16} />
                                        </button>

                                        {/* Archive / Restore */}
                                        <button
                                             onClick={e => {
                                                  e.stopPropagation()
                                                  onArchive(coupon)
                                             }}
                                             className={`p-2 rounded-lg transition-colors ${
                                                  coupon.isActive
                                                       ? "text-stone-400 hover:text-amber-600 hover:bg-amber-50"
                                                       : "text-stone-400 hover:text-emerald-600 hover:bg-emerald-50"
                                             }`}
                                             title={coupon.isActive ? "Archive" : "Restore"}
                                        >
                                             {coupon.isActive ? <Archive size={16} /> : <RotateCcw size={16} />}
                                        </button>

                                        {/* Delete */}
                                        <button
                                             onClick={e => {
                                                  e.stopPropagation()
                                                  onDelete(coupon.id)
                                             }}
                                             className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                             title="Delete"
                                        >
                                             <Trash2 size={16} />
                                        </button>
                                   </div>
                              </td>
                         </tr>
                    ))}
                    </tbody>
               </table>
          </div>
     )
}

// --- HELPERS ---
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
     <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
               isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-100 text-stone-400 border-stone-200"
          }`}
     >
          {isActive ? "Active" : "Inactive"}
     </span>
)

const EmptyState = () => (
     <div className="bg-white border border-stone-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
               <Ticket size={32} />
          </div>
          <div>
               <h3 className="text-lg font-serif text-stone-900">No coupons found</h3>
               <p className="text-stone-400 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
     </div>
)

const TableSkeleton = () => (
     <div className="hidden md:block bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-100 p-4">
               <div className="flex justify-between items-center">
                    <div className="h-3 w-12 bg-stone-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-stone-200 rounded animate-pulse" />
               </div>
          </div>
          <div className="divide-y divide-stone-50">
               {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between animate-pulse">
                         <div className="space-y-2">
                              <div className="h-4 w-24 bg-stone-100 rounded" />
                              <div className="h-3 w-32 bg-stone-50 rounded" />
                         </div>
                         <div className="h-6 w-16 bg-stone-100 rounded" />
                         <div className="h-4 w-20 bg-stone-100 rounded" />
                         <div className="h-4 w-20 bg-stone-100 rounded" />
                    </div>
               ))}
          </div>
     </div>
)

export default CouponsTable
