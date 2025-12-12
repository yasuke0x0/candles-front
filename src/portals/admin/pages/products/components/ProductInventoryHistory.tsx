import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import { createPortal } from "react-dom"
import { AlertCircle, ArrowUpRight, History, Loader2, ShoppingCart, User, X } from "lucide-react"
import { motion } from "framer-motion"
import Cursor from "@components/Cursor.tsx"
import { INVENTORY_MOVEMENTS_LIST_ENDPOINT } from "@api-endpoints"

// Assuming you add this to your api-endpoints
interface ProductInventoryHistoryProps {
     productId: number | null
     isOpen: boolean
     onClose: () => void
     productName: string
}

const ProductInventoryHistory = ({ productId, isOpen, onClose, productName }: ProductInventoryHistoryProps) => {
     const [page, setPage] = useState(1)

     const { data, isLoading } = useQuery({
          queryKey: ["product-inventory-history", productId, page],
          queryFn: async () => {
               if (!productId) return null
               const res = await axios.get(INVENTORY_MOVEMENTS_LIST_ENDPOINT, {
                    params: { page, limit: 10, productId }, // Filter by ID
               })
               return res.data
          },
          enabled: !!productId && isOpen,
     })

     const movements = data?.data || []
     const meta = data?.meta

     // --- HELPERS ---
     const getIcon = (type: string) => {
          switch (type) {
               case "SALE":
                    return <ShoppingCart size={14} className="text-blue-500" />
               case "RESTOCK":
                    return <ArrowUpRight size={14} className="text-emerald-500" />
               case "MANUAL_ADJUSTMENT":
                    return <User size={14} className="text-amber-500" />
               case "DAMAGED":
                    return <AlertCircle size={14} className="text-red-500" />
               default:
                    return <History size={14} className="text-stone-400" />
          }
     }

     const getBadgeStyle = (type: string) => {
          switch (type) {
               case "SALE":
                    return "bg-blue-50 text-blue-700 border-blue-100"
               case "RESTOCK":
                    return "bg-emerald-50 text-emerald-700 border-emerald-100"
               case "MANUAL_ADJUSTMENT":
                    return "bg-amber-50 text-amber-700 border-amber-100"
               case "DAMAGED":
                    return "bg-red-50 text-red-700 border-red-100"
               default:
                    return "bg-stone-50 text-stone-600 border-stone-100"
          }
     }

     if (!isOpen) return null

     return createPortal(
          <div className="fixed inset-0 z-[10001] flex justify-end font-sans">
               <Cursor />

               {/* Backdrop */}
               <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-stone-900/20 backdrop-blur-[1px]"
                    onClick={onClose}
               />

               {/* Drawer */}
               <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-100"
               >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-white z-10">
                         <div>
                              <h2 className="font-serif text-xl text-stone-900 tracking-tight">Stock History</h2>
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
                         ) : movements.length === 0 ? (
                              <div className="flex flex-col items-center justify-center h-64 text-stone-400 gap-3 opacity-50">
                                   <History size={32} />
                                   <span className="text-sm font-medium">No history recorded yet.</span>
                              </div>
                         ) : (
                              <div className="divide-y divide-stone-50">
                                   {movements.map((move: any) => {
                                        const isPositive = move.quantity > 0
                                        return (
                                             <div key={move.id} className="p-5 hover:bg-stone-50/50 transition-colors">
                                                  <div className="flex justify-between items-start mb-2">
                                                       <span
                                                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(move.type)}`}
                                                       >
                                                            {getIcon(move.type)}
                                                            {move.type.replace("_", " ")}
                                                       </span>
                                                       <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                                            {format(new Date(move.createdAt), "MMM d, HH:mm")}
                                                       </span>
                                                  </div>

                                                  <div className="flex justify-between items-end">
                                                       <div className="text-xs text-stone-500 space-y-1">
                                                            {move.type === "SALE" && move.orderId && (
                                                                 <p>
                                                                      Order <span className="font-mono font-bold text-stone-700">#{move.orderId}</span>
                                                                 </p>
                                                            )}
                                                            {move.type === "MANUAL_ADJUSTMENT" && move.user && (
                                                                 <p>
                                                                      By <span className="font-bold text-stone-700">{move.user.firstName}</span>
                                                                 </p>
                                                            )}
                                                            {move.reason && <p className="italic text-stone-400">"{move.reason}"</p>}
                                                       </div>

                                                       <div className="text-right">
                                                            <p className={`font-mono text-lg font-bold leading-none mb-1 ${isPositive ? "text-emerald-600" : "text-stone-900"}`}>
                                                                 {isPositive ? "+" : ""}
                                                                 {move.quantity}
                                                            </p>
                                                            <p className="text-[10px] text-stone-400 font-medium">
                                                                 Balance: <span className="text-stone-600">{move.stockAfter}</span>
                                                            </p>
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
                                   className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 disabled:opacity-50"
                              >
                                   Prev
                              </button>
                              <span className="text-[10px] font-bold text-stone-400">Page {page}</span>
                              <button
                                   disabled={page >= meta.lastPage}
                                   onClick={() => setPage(p => p + 1)}
                                   className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 disabled:opacity-50"
                              >
                                   Next
                              </button>
                         </div>
                    )}
               </motion.div>
          </div>,
          document.body
     )
}

export default ProductInventoryHistory
