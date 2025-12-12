import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import { createPortal } from "react-dom"
import { ArrowRight, Calendar, Loader2, Tag, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Cursor from "@components/Cursor.tsx"
import { DISCOUNT_HISTORY_ENDPOINT } from "@api-endpoints"

interface ProductDiscountHistoryProps {
     productId: number | null
     isOpen: boolean
     onClose: () => void
     productName: string
}

const ProductDiscountHistory = ({ productId, isOpen, onClose, productName }: ProductDiscountHistoryProps) => {
     const [page, setPage] = useState(1)

     // Handle Escape Key
     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.key === "Escape" && isOpen) {
                    onClose()
               }
          }
          if (isOpen) window.addEventListener("keydown", handleKeyDown)
          return () => window.removeEventListener("keydown", handleKeyDown)
     }, [isOpen, onClose])

     const { data, isLoading } = useQuery({
          queryKey: ["product-discount-history", productId, page],
          queryFn: async () => {
               if (!productId) return null
               const res = await axios.get(DISCOUNT_HISTORY_ENDPOINT, {
                    params: { page, limit: 10, productId },
               })
               return res.data
          },
          enabled: !!productId && isOpen,
     })

     const history = data?.data || []
     const meta = data?.meta

     return createPortal(
          <AnimatePresence>
               {isOpen && (
                    <div className="fixed inset-0 z-[10001] flex justify-end font-sans pointer-events-none">
                         <Cursor />

                         {/* Backdrop */}
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute inset-0 bg-stone-900/20 backdrop-blur-[1px] pointer-events-auto"
                              onClick={onClose}
                         />

                         {/* Drawer */}
                         <motion.div
                              initial={{ x: "100%" }}
                              animate={{ x: 0 }}
                              exit={{ x: "100%" }}
                              transition={{ type: "spring", damping: 25, stiffness: 200 }}
                              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-100 pointer-events-auto"
                         >
                              {/* Header */}
                              <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-white z-10">
                                   <div>
                                        <h2 className="font-serif text-xl text-stone-900 tracking-tight">Discount History</h2>
                                        <p className="text-xs text-stone-400 mt-0.5 truncate max-w-[250px]">{productName}</p>
                                   </div>
                                   <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                                        <X size={20} className="text-stone-400" />
                                   </button>
                              </div>

                              {/* Content */}
                              <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                                   {isLoading ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-stone-400 gap-3">
                                             <Loader2 className="animate-spin" size={24} />
                                             <span className="text-xs font-bold uppercase tracking-widest">Loading...</span>
                                        </div>
                                   ) : history.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-stone-400 gap-3 opacity-50">
                                             <Tag size={32} />
                                             <span className="text-sm font-medium">No discount history found.</span>
                                        </div>
                                   ) : (
                                        <div className="divide-y divide-stone-50">
                                             {history.map((record: any) => {
                                                  const isPercentage = record.discountType === "PERCENTAGE"
                                                  const isActive = !record.removedAt

                                                  return (
                                                       <div key={record.id} className={`p-5 transition-colors ${isActive ? "bg-stone-50/80" : "hover:bg-stone-50/50"}`}>
                                                            {/* Status & Date */}
                                                            <div className="flex justify-between items-start mb-3">
                                                                 <span
                                                                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-stone-100 text-stone-500 border-stone-200"}`}
                                                                 >
                                                                      {isActive ? "Active Now" : "Expired"}
                                                                 </span>
                                                                 <div className="text-right">
                                                                      <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                                                           <Calendar size={10} />
                                                                           {format(new Date(record.appliedAt), "MMM d, yyyy")}
                                                                      </div>
                                                                      {record.removedAt && (
                                                                           <div className="text-[9px] text-stone-300 mt-0.5">to {format(new Date(record.removedAt), "MMM d, yyyy")}</div>
                                                                      )}
                                                                 </div>
                                                            </div>

                                                            {/* Discount Details */}
                                                            <div className="mb-4">
                                                                 <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                                                                      {record.discountName}
                                                                      <span className="text-xs font-normal text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                                                           {isPercentage ? `-${record.discountValue}%` : `-€${record.discountValue}`}
                                                                      </span>
                                                                 </h4>
                                                            </div>

                                                            {/* Price Impact */}
                                                            <div className="bg-white border border-stone-100 rounded-xl p-3 flex items-center justify-between">
                                                                 <div className="text-xs text-stone-400">
                                                                      <p className="uppercase tracking-wider font-bold text-[9px] mb-0.5">Original</p>
                                                                      <span className="line-through decoration-stone-300">€{Number(record.originalPrice).toFixed(2)}</span>
                                                                 </div>

                                                                 <ArrowRight size={14} className="text-stone-300" />

                                                                 <div className="text-right">
                                                                      <p className="uppercase tracking-wider font-bold text-[9px] text-emerald-600 mb-0.5">Sale Price</p>
                                                                      <span className="font-mono font-bold text-stone-900 text-base">€{Number(record.discountedPrice).toFixed(2)}</span>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  )
                                             })}
                                        </div>
                                   )}
                              </div>

                              {/* Footer / Pagination */}
                              {meta && meta.lastPage > 1 && (
                                   <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between shrink-0">
                                        <button
                                             disabled={page === 1}
                                             onClick={() => setPage(p => p - 1)}
                                             className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 disabled:opacity-50 transition-colors"
                                        >
                                             Prev
                                        </button>
                                        <span className="text-[10px] font-bold text-stone-400">Page {page}</span>
                                        <button
                                             disabled={page >= meta.lastPage}
                                             onClick={() => setPage(p => p + 1)}
                                             className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 disabled:opacity-50 transition-colors"
                                        >
                                             Next
                                        </button>
                                   </div>
                              )}
                         </motion.div>
                    </div>
               )}
          </AnimatePresence>,
          document.body
     )
}

export default ProductDiscountHistory
