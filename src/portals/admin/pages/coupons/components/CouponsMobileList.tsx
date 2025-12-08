import { Archive, Calendar, Edit2, RotateCcw, Ticket, Trash2 } from "lucide-react"
import type { ICoupon } from "@api-models"

interface CouponsMobileListProps {
     coupons: ICoupon[]
     isLoading: boolean
     onEdit: (coupon: ICoupon) => void
     onArchive: (coupon: ICoupon) => void
     onDelete: (id: number) => void
}

const CouponsMobileList = ({ coupons, isLoading, onEdit, onArchive, onDelete }: CouponsMobileListProps) => {
     if (isLoading) {
          return (
               <div className="md:hidden space-y-4">
                    {[1, 2, 3].map(i => (
                         <div key={i} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm animate-pulse">
                              <div className="flex justify-between items-start mb-4">
                                   <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-stone-100" />
                                        <div className="space-y-2">
                                             <div className="h-4 w-24 bg-stone-100 rounded" />
                                             <div className="h-3 w-16 bg-stone-50 rounded" />
                                        </div>
                                   </div>
                              </div>
                              <div className="h-20 bg-stone-50 rounded-xl mb-4" />
                              <div className="flex gap-3">
                                   <div className="h-10 flex-1 bg-stone-100 rounded-lg" />
                                   <div className="h-10 flex-1 bg-stone-100 rounded-lg" />
                              </div>
                         </div>
                    ))}
               </div>
          )
     }

     return (
          <div className="grid grid-cols-1 gap-4 md:hidden pb-20">
               {coupons.map(coupon => (
                    <MobileCouponCard
                         key={coupon.id}
                         coupon={coupon}
                         onEdit={onEdit}
                         onArchive={onArchive}
                         onDelete={onDelete}
                    />
               ))}
          </div>
     )
}

const MobileCouponCard = ({ coupon, onEdit, onArchive, onDelete }: { coupon: ICoupon; onEdit: any; onArchive: any; onDelete: any }) => (
     <div
          onClick={() => onEdit(coupon)}
          className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden active:scale-[0.98] transition-transform"
     >
          {/* Top Row */}
          <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-900">
                         <Ticket size={18} />
                    </div>
                    <div>
                         <h3 className="font-mono font-bold text-stone-900 text-lg tracking-tight">{coupon.code}</h3>
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${coupon.isActive ? "text-emerald-600" : "text-stone-400"}`}>
                              {coupon.isActive ? "Active" : "Inactive"}
                         </span>
                    </div>
               </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-stone-50">
               <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest block mb-1">Value</span>
                    <span className="font-serif text-xl text-stone-900">{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `${coupon.value.toFixed(2)}`}</span>
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
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                         <span>{coupon.maxUses ? `${coupon.maxUses} max` : "Unlimited uses"}</span>
                         {coupon.minOrderAmount !== null && coupon.minOrderAmount > 0 && <span>• Min order €{coupon.minOrderAmount}</span>}
                    </div>
               </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-2">
               {/* Edit Button */}
               <button
                    onClick={e => {
                         e.stopPropagation()
                         onEdit(coupon)
                    }}
                    className="flex-1 py-3 bg-stone-50 text-stone-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
               >
                    <Edit2 size={14} />
               </button>

               {/* Archive Button */}
               <button
                    onClick={e => {
                         e.stopPropagation()
                         onArchive(coupon)
                    }}
                    className={`flex-1 py-3 bg-white border border-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 ${
                         coupon.isActive ? "text-stone-500 hover:text-amber-600 hover:bg-amber-50" : "text-stone-500 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
               >
                    {coupon.isActive ? <Archive size={14} /> : <RotateCcw size={14} />}
               </button>

               {/* Delete Button */}
               <button
                    onClick={e => {
                         e.stopPropagation()
                         onDelete(coupon.id)
                    }}
                    className="flex-1 py-3 bg-white border border-stone-200 text-stone-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
               >
                    <Trash2 size={14} />
               </button>
          </div>
     </div>
)

export default CouponsMobileList
