import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import { createPortal } from "react-dom"
import { ArrowRight, DollarSign, Loader2, TrendingDown, TrendingUp, User, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Cursor from "@components/Cursor.tsx"
import { PRODUCT_PRICE_HISTORY_ENDPOINT } from "@api-endpoints"

interface ProductPriceHistoryProps {
     productId: number | null
     isOpen: boolean
     onClose: () => void
     productName: string
}

// --- INTERNAL CHART COMPONENT ---
const PriceEvolutionChart = ({ data }: { data: any[] }) => {
     // 1. Prepare Data (Sort Oldest -> Newest)
     const chartData = useMemo(() => {
          if (!data || data.length < 2) return []
          return [...data].reverse().map(d => ({
               price: Number(d.newPrice),
               date: d.createdAt,
          }))
     }, [data])

     if (chartData.length < 2) return null

     // 2. Calculations
     const width = 300
     const height = 80
     const padding = 10

     const prices = chartData.map(d => d.price)
     const minPrice = Math.min(...prices)
     const maxPrice = Math.max(...prices)
     const range = maxPrice - minPrice || 1 // Avoid divide by zero

     const getX = (index: number) => (index / (chartData.length - 1)) * (width - 2 * padding) + padding
     const getY = (price: number) => height - padding - ((price - minPrice) / range) * (height - 2 * padding)

     // 3. Generate SVG Path
     const linePoints = chartData.map((d, i) => `${getX(i)},${getY(d.price)}`).join(" ")
     const areaPoints = `${getX(0)},${height} ${linePoints} ${getX(chartData.length - 1)},${height}`

     const isTrendUp = chartData[chartData.length - 1].price >= chartData[0].price
     const color = isTrendUp ? "#10b981" : "#ef4444" // Emerald or Red
     const tailwindText = isTrendUp ? "text-emerald-600" : "text-red-600"

     return (
          <div className="w-full p-6 bg-stone-50 border-b border-stone-100">
               <div className="flex justify-between items-end mb-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Price Trend</h4>
                    <div className={`flex items-center gap-1 text-xs font-bold ${tailwindText}`}>
                         {isTrendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                         <span>{(((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100).toFixed(1)}%</span>
                    </div>
               </div>

               <div className="relative w-full h-24">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                         <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                                   <stop offset="100%" stopColor={color} stopOpacity="0" />
                              </linearGradient>
                         </defs>

                         {/* Area Fill */}
                         <path d={`M${areaPoints}Z`} fill="url(#chartGradient)" stroke="none" />

                         {/* Line */}
                         <polyline points={linePoints} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                         {/* Points */}
                         {chartData.map((d, i) => (
                              <circle key={i} cx={getX(i)} cy={getY(d.price)} r="2.5" className="fill-white stroke-2" stroke={color} />
                         ))}
                    </svg>

                    {/* Labels */}
                    <div className="absolute top-0 right-0 text-[9px] font-bold text-stone-400 bg-white/80 px-1.5 py-0.5 rounded shadow-sm border border-stone-100">
                         High: €{maxPrice.toFixed(2)}
                    </div>
                    <div className="absolute bottom-0 left-0 text-[9px] font-bold text-stone-400 bg-white/80 px-1.5 py-0.5 rounded shadow-sm border border-stone-100">
                         Low: €{minPrice.toFixed(2)}
                    </div>
               </div>
          </div>
     )
}

const ProductPriceHistory = ({ productId, isOpen, onClose, productName }: ProductPriceHistoryProps) => {
     const [page, setPage] = useState(1)

     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.key === "Escape" && isOpen) onClose()
          }
          if (isOpen) window.addEventListener("keydown", handleKeyDown)
          return () => window.removeEventListener("keydown", handleKeyDown)
     }, [isOpen, onClose])

     const { data, isLoading } = useQuery({
          queryKey: ["product-price-history", productId, page],
          queryFn: async () => {
               if (!productId) return null
               const res = await axios.get(PRODUCT_PRICE_HISTORY_ENDPOINT, {
                    params: { page, limit: 10, productId },
               })
               return res.data
          },
          enabled: !!productId && isOpen,
     })

     const history = data?.data || []
     const meta = data?.meta

     return createPortal(
          <AnimatePresence mode="wait">
               {isOpen && (
                    <div className="fixed inset-0 z-[10001] flex justify-end font-sans pointer-events-none">
                         <Cursor />

                         {/* Backdrop */}
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
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
                              <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-white z-10">
                                   <div>
                                        <h2 className="font-serif text-xl text-stone-900 tracking-tight">Price Evolution</h2>
                                        <p className="text-xs text-stone-400 mt-0.5 truncate max-w-[250px]">{productName}</p>
                                   </div>
                                   <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                                        <X size={20} className="text-stone-400" />
                                   </button>
                              </div>

                              <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                                   {isLoading ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-stone-400 gap-3">
                                             <Loader2 className="animate-spin" size={24} />
                                             <span className="text-xs font-bold uppercase tracking-widest">Loading...</span>
                                        </div>
                                   ) : history.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-stone-400 gap-3 opacity-50">
                                             <DollarSign size={32} />
                                             <span className="text-sm font-medium">No price changes recorded.</span>
                                        </div>
                                   ) : (
                                        <>
                                             {/* CHART SECTION */}
                                             <PriceEvolutionChart data={history} />

                                             {/* LIST SECTION */}
                                             <div className="divide-y divide-stone-50">
                                                  {history.map((record: any) => {
                                                       const isIncrease = Number(record.newPrice) > Number(record.oldPrice)
                                                       return (
                                                            <div key={record.id} className="p-5 hover:bg-stone-50/50 transition-colors">
                                                                 <div className="flex justify-between items-center mb-3">
                                                                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                                                           {format(new Date(record.createdAt), "MMM d, yyyy • HH:mm")}
                                                                      </span>
                                                                      <span
                                                                           className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                                                                                isIncrease
                                                                                     ? "bg-red-50 text-red-700 border-red-100"
                                                                                     : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                                           }`}
                                                                      >
                                                                           {isIncrease ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                                           {isIncrease ? "Increase" : "Decrease"}
                                                                      </span>
                                                                 </div>

                                                                 <div className="flex items-center justify-between bg-white border border-stone-100 rounded-xl p-3">
                                                                      <div className="text-left">
                                                                           <p className="text-[9px] font-bold uppercase text-stone-400 tracking-wider mb-0.5">Was</p>
                                                                           <span className="font-mono text-sm text-stone-500 line-through">
                                                                                €{Number(record.oldPrice).toFixed(2)}
                                                                           </span>
                                                                      </div>
                                                                      <ArrowRight size={16} className="text-stone-300" />
                                                                      <div className="text-right">
                                                                           <p className="text-[9px] font-bold uppercase text-stone-400 tracking-wider mb-0.5">Now</p>
                                                                           <span className="font-mono text-lg font-bold text-stone-900">€{Number(record.newPrice).toFixed(2)}</span>
                                                                      </div>
                                                                 </div>

                                                                 {record.user && (
                                                                      <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-400 justify-end">
                                                                           <User size={12} />
                                                                           <span>
                                                                                Updated by <span className="font-bold text-stone-600">{record.user.firstName}</span>
                                                                           </span>
                                                                      </div>
                                                                 )}
                                                            </div>
                                                       )
                                                  })}
                                             </div>
                                        </>
                                   )}
                              </div>

                              {/* Footer */}
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
                    </div>
               )}
          </AnimatePresence>,
          document.body
     )
}

export default ProductPriceHistory
