import { useEffect, useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"
import {
     Calendar,
     ChevronLeft,
     ChevronRight,
     ChevronsLeft,
     ChevronsRight,
     Clock,
     Filter,
     Loader2,
     Package,
     RotateCcw,
     Search,
     Truck,
     XCircle,
     CheckCircle2,
     X,
     AlertCircle, ArrowLeft,
} from "lucide-react"
import { format } from "date-fns"
import OrderDetailsModal from "@portals/admin/pages/orders/components/OrderDetailsModal.tsx"
import { ORDERS_LIST_ENDPOINT } from "@api-endpoints"

// --- TYPES ---
interface IOrderSummary {
     id: number
     totalAmount: string
     status: string
     createdAt: string
     items: { id: number }[]
     user: { firstName: string | null; lastName: string | null; email: string }
     // Added optional shippingAddress in case backend returns it, otherwise fallback to user
     shippingAddress?: { firstName: string; lastName: string }
}

interface IMeta {
     currentPage: number
     firstPage: number
     lastPage: number
     perPage: number
     total: number
}

// --- UTILS ---
function useDebounce<T>(value: T, delay: number): T {
     const [debouncedValue, setDebouncedValue] = useState(value)
     useEffect(() => {
          const handler = setTimeout(() => setDebouncedValue(value), delay)
          return () => clearTimeout(handler)
     }, [value, delay])
     return debouncedValue
}

// --- CONSTANTS ---
const PAGE_SIZE_OPTIONS = [15, 25, 50, 100]

const Orders = () => {
     const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

     // -- STATE --
     const [page, setPage] = useState(1)
     const [limit, setLimit] = useState(15)
     const [statusFilter, setStatusFilter] = useState<string>("ALL")
     const [searchTerm, setSearchTerm] = useState("")
     const [startDate, setStartDate] = useState("")
     const [endDate, setEndDate] = useState("")

     // UI States
     const [showDesktopFilters, setShowDesktopFilters] = useState(false)
     const [showMobileFilterModal, setShowMobileFilterModal] = useState(false)

     const debouncedSearch = useDebounce(searchTerm, 500)

     useEffect(() => {
          setPage(1)
     }, [statusFilter, debouncedSearch, startDate, endDate, limit])

     // --- FETCH ORDERS ---
     const {
          data: orderData,
          isLoading,
          refetch,
          isFetching,
     } = useQuery({
          queryKey: ["admin-orders", page, limit, statusFilter, debouncedSearch, startDate, endDate],
          queryFn: async () => {
               const params: any = {
                    page: page,
                    limit: limit,
               }

               if (statusFilter !== "ALL") params.status = statusFilter
               if (debouncedSearch) params.search = debouncedSearch
               if (startDate) params.startDate = startDate
               if (endDate) params.endDate = endDate

               const [res] = await Promise.all([axios.get(ORDERS_LIST_ENDPOINT, { params }), new Promise(resolve => setTimeout(resolve, 500))])

               return res.data
          },
          placeholderData: keepPreviousData,
     })

     const orders = orderData?.data || []
     const meta: IMeta | undefined = orderData?.meta

     const handleCloseModal = () => {
          setSelectedOrderId(null)
          refetch()
     }

     // --- CONFIG ---
     const tabs = [
          { label: "All", value: "ALL" },
          { label: "Paid", value: "succeeded" },
          { label: "Ready", value: "READY_TO_SHIP" },
          { label: "Shipped", value: "SHIPPED" },
          { label: "Cancelled", value: "canceled" },
     ]

     const activeFiltersCount = [statusFilter !== "ALL", startDate, endDate, searchTerm !== ""].filter(Boolean).length

     const clearFilters = () => {
          setStatusFilter("ALL")
          setSearchTerm("")
          setStartDate("")
          setEndDate("")
     }

     // --- Helper to get Customer Name ---
     const getCustomerName = (order: IOrderSummary) => {
          // Priority 1: Shipping Address Name (if available)
          if (order.shippingAddress && (order.shippingAddress.firstName || order.shippingAddress.lastName)) {
               return `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim()
          }
          // Priority 2: User Name
          if (order.user.firstName || order.user.lastName) {
               return `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
          }
          // Fallback
          return "Guest Customer"
     }

     const getPageNumbers = () => {
          if (!meta) return []
          const total = meta.lastPage
          const current = meta.currentPage
          const delta = 1
          const range = []
          const rangeWithDots = []
          let l

          range.push(1)
          for (let i = current - delta; i <= current + delta; i++) {
               if (i < total && i > 1) range.push(i)
          }
          range.push(total)

          for (let i of range) {
               if (l) {
                    if (i - l === 2) rangeWithDots.push(l + 1)
                    else if (i - l !== 1) rangeWithDots.push("...")
               }
               rangeWithDots.push(i)
               l = i
          }
          return rangeWithDots
     }

     return (
          <div className="h-full flex flex-col bg-stone-50/50 font-sans relative">
               {/* --- HEADER --- */}
               <div className="w-full bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm z-30 shrink-0">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                         <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between gap-3">
                                   <div className="flex items-baseline gap-3">
                                        <h1 className="font-serif text-2xl text-stone-900 tracking-tight">Orders</h1>
                                        {meta && !isLoading && (
                                             <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider animate-in fade-in">
                                                  {meta.total} Total
                                             </span>
                                        )}
                                   </div>

                                   <div className="hidden md:block flex-1 max-w-md ml-auto mr-2 relative group">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                             <Search className="text-stone-400 group-focus-within:text-stone-800 transition-colors" size={16} />
                                        </div>
                                        <input
                                             type="text"
                                             placeholder="Search by ID, email, name..."
                                             value={searchTerm}
                                             onChange={e => setSearchTerm(e.target.value)}
                                             className="w-full pl-10 pr-4 py-2 bg-stone-100 border-transparent focus:bg-white focus:border-stone-300 border rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-stone-100"
                                        />
                                   </div>

                                   <div className="flex items-center gap-2">
                                        {activeFiltersCount > 0 && (
                                             <button
                                                  onClick={clearFilters}
                                                  className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
                                             >
                                                  <RotateCcw size={14} />
                                                  Reset
                                             </button>
                                        )}

                                        <button
                                             onClick={() => {
                                                  if (window.innerWidth < 768) {
                                                       setShowMobileFilterModal(true)
                                                  } else {
                                                       setShowDesktopFilters(!showDesktopFilters)
                                                  }
                                             }}
                                             className={`relative p-2.5 rounded-xl border transition-all duration-200 flex-shrink-0 ${
                                                  showDesktopFilters || activeFiltersCount > 0
                                                       ? "bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-900/20"
                                                       : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                                             }`}
                                        >
                                             <Filter size={18} />
                                             {activeFiltersCount > 0 && (
                                                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                                                       {activeFiltersCount}
                                                  </span>
                                             )}
                                        </button>
                                   </div>
                              </div>

                              {/* Desktop Filters Drawer */}
                              <div
                                   className={`hidden md:block overflow-hidden transition-all duration-300 ease-in-out ${showDesktopFilters ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                              >
                                   <div className="flex items-center justify-between gap-4 pb-1">
                                        <div className="flex items-center gap-1.5">
                                             {tabs.map(tab => (
                                                  <button
                                                       key={tab.value}
                                                       onClick={() => setStatusFilter(tab.value)}
                                                       className={`whitespace-nowrap px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                                                            statusFilter === tab.value
                                                                 ? "bg-stone-800 text-white border-stone-800 shadow-md"
                                                                 : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:text-stone-800 hover:bg-stone-50"
                                                       }`}
                                                  >
                                                       {tab.label}
                                                  </button>
                                             ))}
                                             {statusFilter !== "ALL" && (
                                                  <button onClick={() => setStatusFilter("ALL")} className="p-1 text-stone-400 hover:text-red-500 transition-colors">
                                                       <XCircle size={16} />
                                                  </button>
                                             )}
                                        </div>

                                        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-stone-200 shadow-sm">
                                             <div className="pl-2 text-stone-400">
                                                  <Calendar size={14} />
                                             </div>
                                             <input
                                                  type="date"
                                                  value={startDate}
                                                  onChange={e => setStartDate(e.target.value)}
                                                  className="bg-transparent text-xs font-medium text-stone-600 focus:outline-none p-1"
                                             />
                                             <span className="text-stone-300">-</span>
                                             <input
                                                  type="date"
                                                  value={endDate}
                                                  onChange={e => setEndDate(e.target.value)}
                                                  className="bg-transparent text-xs font-medium text-stone-600 focus:outline-none p-1"
                                             />
                                             {(startDate || endDate) && (
                                                  <button
                                                       onClick={() => {
                                                            setStartDate("")
                                                            setEndDate("")
                                                       }}
                                                       className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-red-500"
                                                  >
                                                       <X size={14} />
                                                  </button>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>

               {/* --- SCROLLABLE CONTENT AREA --- */}
               <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-stone-200">
                    <div className="max-w-7xl mx-auto">
                         {isLoading && !orderData ? (
                              <TableSkeleton />
                         ) : orders.length === 0 ? (
                              <EmptyState onClear={clearFilters} hasFilters={activeFiltersCount > 0} />
                         ) : (
                              <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden relative transition-all flex flex-col">
                                   {isFetching && (
                                        <div className="absolute top-0 left-0 right-0 z-20 h-0.5 bg-stone-100 overflow-hidden">
                                             <div className="h-full bg-stone-900 animate-loading-bar"></div>
                                        </div>
                                   )}

                                   {/* Hide scrollbar in mobile */}
                                   <div className="overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                                        <style>{`
                                             div::-webkit-scrollbar {
                                                  display: none;
                                             }
                                        `}</style>
                                        <table className="w-full text-left border-collapse">
                                             <thead className="bg-stone-50 border-b border-stone-100 sticky top-0 z-20 shadow-sm">
                                             <tr>
                                                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 w-20">ID</th>
                                                  <th className="hidden md:table-cell px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Date</th>
                                                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Customer</th>
                                                  <th className="hidden md:table-cell px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                                                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Total</th>
                                                  <th className="w-10"></th>
                                             </tr>
                                             </thead>
                                             <tbody className="divide-y divide-stone-50">
                                             {orders.map((order: IOrderSummary) => (
                                                  <tr
                                                       key={order.id}
                                                       onClick={() => setSelectedOrderId(order.id)}
                                                       className="group hover:bg-stone-50/80 cursor-pointer transition-colors focus:outline-none focus:bg-stone-50"
                                                       tabIndex={0}
                                                  >
                                                       <td className="px-4 py-4 align-top">
                                                            <span className="font-mono font-bold text-stone-900 text-xs bg-stone-100 px-1.5 py-0.5 rounded">#{order.id}</span>
                                                       </td>
                                                       <td className="hidden md:table-cell px-6 py-4 align-top">
                                                            <div className="flex flex-col">
                                                                 <span className="text-xs font-medium text-stone-700">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                                                                 <span className="text-[10px] text-stone-400">{format(new Date(order.createdAt), "HH:mm")}</span>
                                                            </div>
                                                       </td>
                                                       <td className="px-4 py-4 align-top">
                                                            <div className="flex flex-col max-w-[160px] md:max-w-none">
                                                                 <span className="text-sm font-bold text-stone-900 truncate">
                                                                      {getCustomerName(order)}
                                                                 </span>
                                                                 <span className="text-[11px] text-stone-500 truncate">{order.user?.email}</span>

                                                                 {/* MOBILE META BLOCK */}
                                                                 <div className="md:hidden mt-2 flex flex-col items-start gap-1">
                                                                      <StatusBadge status={order.status} className="px-1.5 py-0.5 text-[9px]" />
                                                                      <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                                                                           <Calendar size={10} />
                                                                           {format(new Date(order.createdAt), "MMMM d, yyyy • HH:mm")}
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       </td>

                                                       <td className="hidden md:table-cell px-4 py-4 align-top">
                                                            <StatusBadge status={order.status} />
                                                       </td>

                                                       <td className="px-4 py-4 align-top text-right">
                                                            <div className="flex flex-col items-end gap-1">
                                                                 <div className="font-serif text-stone-900 text-sm font-medium">€{Number(order.totalAmount).toFixed(2)}</div>
                                                                 <div className="text-[10px] text-stone-400">{order.items.length} items</div>
                                                            </div>
                                                       </td>
                                                       <td className="px-2 py-4 align-middle text-stone-300">
                                                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2" />
                                                       </td>
                                                  </tr>
                                             ))}
                                             </tbody>
                                        </table>
                                   </div>

                                   {meta && meta.lastPage > 1 && (
                                        <div className="bg-white border-t border-stone-100 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                                             <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
                                                  <span className="text-xs text-stone-400 font-medium">
                                                       Showing <span className="text-stone-900 font-bold">{(meta.currentPage - 1) * meta.perPage + 1}</span> -{" "}
                                                       <span className="text-stone-900 font-bold">{Math.min(meta.currentPage * meta.perPage, meta.total)}</span> of{" "}
                                                       <span className="text-stone-900 font-bold">{meta.total}</span>
                                                  </span>
                                                  <div className="flex items-center gap-2">
                                                       <span className="text-[10px] uppercase font-bold text-stone-400 hidden sm:inline">Rows:</span>
                                                       <select
                                                            value={limit}
                                                            onChange={e => setLimit(Number(e.target.value))}
                                                            className="text-xs font-bold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-stone-900/10 cursor-pointer"
                                                       >
                                                            {PAGE_SIZE_OPTIONS.map(opt => (
                                                                 <option key={opt} value={opt}>
                                                                      {opt}
                                                                 </option>
                                                            ))}
                                                       </select>
                                                  </div>
                                             </div>
                                             <div className="flex items-center gap-1.5">
                                                  <button
                                                       onClick={() => setPage(1)}
                                                       disabled={meta.currentPage === 1}
                                                       className="p-2 bg-white border border-stone-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 text-stone-500"
                                                  >
                                                       <ChevronsLeft size={16} />
                                                  </button>
                                                  <button
                                                       onClick={() => setPage(p => Math.max(1, p - 1))}
                                                       disabled={meta.currentPage === 1}
                                                       className="p-2 bg-white border border-stone-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 text-stone-500 mr-1"
                                                  >
                                                       <ChevronLeft size={16} />
                                                  </button>
                                                  <div className="hidden sm:flex items-center gap-1">
                                                       {getPageNumbers().map((pageNum, idx) =>
                                                            typeof pageNum === "number" ? (
                                                                 <button
                                                                      key={idx}
                                                                      onClick={() => setPage(pageNum)}
                                                                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${meta.currentPage === pageNum ? "bg-stone-900 text-white shadow-md" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                                                                 >
                                                                      {pageNum}
                                                                 </button>
                                                            ) : (
                                                                 <span key={idx} className="w-8 text-center text-stone-400 text-xs">
                                                                      ...
                                                                 </span>
                                                            )
                                                       )}
                                                  </div>
                                                  <span className="sm:hidden text-xs font-bold text-stone-900 px-2">Page {meta.currentPage}</span>
                                                  <button
                                                       onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
                                                       disabled={meta.currentPage === meta.lastPage}
                                                       className="p-2 bg-white border border-stone-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 text-stone-500 ml-1"
                                                  >
                                                       <ChevronRight size={16} />
                                                  </button>
                                                  <button
                                                       onClick={() => setPage(meta.lastPage)}
                                                       disabled={meta.currentPage === meta.lastPage}
                                                       className="p-2 bg-white border border-stone-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 text-stone-500"
                                                  >
                                                       <ChevronsRight size={16} />
                                                  </button>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         )}
                    </div>

                    <OrderDetailsModal orderId={selectedOrderId} onClose={handleCloseModal} />

                    {/* Mobile Filter Modal */}
                    {showMobileFilterModal && (
                         <div className="fixed inset-0 z-[60] bg-stone-50 flex flex-col md:hidden animate-in slide-in-from-bottom-5 duration-300">
                              <div className="bg-white px-4 py-4 border-b border-stone-200 flex items-center justify-between sticky top-0">
                                   <div className="flex items-center gap-2">
                                        <button onClick={() => setShowMobileFilterModal(false)} className="p-2 -ml-2 text-stone-600">
                                             <ArrowLeft size={20} />
                                        </button>
                                        <h2 className="text-lg font-serif font-bold text-stone-900">Filters</h2>
                                   </div>
                                   {activeFiltersCount > 0 && (
                                        <button onClick={clearFilters} className="text-xs font-bold text-red-500 uppercase tracking-wider">
                                             Reset
                                        </button>
                                   )}
                              </div>
                              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                   <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-stone-400 tracking-wider">Search</label>
                                        <div className="relative">
                                             <Search className="absolute left-3 top-3 text-stone-400" size={16} />
                                             <input
                                                  type="text"
                                                  value={searchTerm}
                                                  onChange={e => setSearchTerm(e.target.value)}
                                                  placeholder="Order ID, Customer..."
                                                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-stone-900 outline-none"
                                             />
                                        </div>
                                   </div>
                                   <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-stone-400 tracking-wider">Status</label>
                                        <div className="grid grid-cols-2 gap-2">
                                             {tabs.map(tab => (
                                                  <button
                                                       key={tab.value}
                                                       onClick={() => setStatusFilter(tab.value)}
                                                       className={`py-3 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                                                            statusFilter === tab.value ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200"
                                                       }`}
                                                  >
                                                       {tab.label}
                                                  </button>
                                             ))}
                                        </div>
                                   </div>
                                   <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-stone-400 tracking-wider">Date Range</label>
                                        <div className="grid grid-cols-2 gap-3">
                                             <div>
                                                  <span className="text-[10px] text-stone-400 mb-1 block">From</span>
                                                  <input
                                                       type="date"
                                                       value={startDate}
                                                       onChange={e => setStartDate(e.target.value)}
                                                       className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm"
                                                  />
                                             </div>
                                             <div>
                                                  <span className="text-[10px] text-stone-400 mb-1 block">To</span>
                                                  <input
                                                       type="date"
                                                       value={endDate}
                                                       onChange={e => setEndDate(e.target.value)}
                                                       className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm"
                                                  />
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div className="bg-white p-4 border-t border-stone-200">
                                   <button
                                        onClick={() => setShowMobileFilterModal(false)}
                                        className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl text-sm shadow-lg active:scale-95 transition-transform"
                                   >
                                        Show Results
                                   </button>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     )
}

// --- COMPONENTS ---

const TableSkeleton = () => (
     <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
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
                              <div className="h-4 w-10 bg-stone-100 rounded" />
                              <div className="h-3 w-24 bg-stone-50 rounded" />
                         </div>
                         <div className="h-6 w-20 bg-stone-100 rounded-full" />
                         <div className="space-y-2 text-right">
                              <div className="h-4 w-16 bg-stone-100 rounded ml-auto" />
                              <div className="h-3 w-8 bg-stone-50 rounded ml-auto" />
                         </div>
                    </div>
               ))}
          </div>
     </div>
)

const EmptyState = ({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) => (
     <div className="bg-white border border-stone-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-2">
               <Package size={24} />
          </div>
          <h3 className="text-base font-serif font-medium text-stone-900">No orders found</h3>
          <p className="text-stone-400 text-xs max-w-xs mx-auto">We couldn't find any orders matching your current filters.</p>
          {hasFilters && (
               <button
                    onClick={onClear}
                    className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-red-600 border-b border-stone-200 hover:border-red-200 pb-0.5 transition-colors"
               >
                    Clear Filters
               </button>
          )}
     </div>
)

const StatusBadge = ({ status, className = "" }: { status: string; className?: string }) => {
     const styles: Record<string, string> = {
          created: "bg-stone-100 text-stone-600 border-stone-200",
          succeeded: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
          READY_TO_SHIP: "bg-violet-50 text-violet-700 border-violet-200 ring-violet-100",
          SHIPPED: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
          canceled: "bg-red-50 text-red-700 border-red-200 ring-red-100",
          processing: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
          requires_action: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-100",
     }

     const icons: Record<string, React.ReactNode> = {
          created: <Clock size={10} />,
          succeeded: <CheckCircle2 size={10} />,
          READY_TO_SHIP: <Package size={10} />,
          SHIPPED: <Truck size={10} />,
          canceled: <XCircle size={10} />,
          processing: <Loader2 size={10} className="animate-spin" />,
          requires_action: <AlertCircle size={10} />,
     }

     const label = status === "succeeded" ? "PAID" : status.replace(/_/g, " ")

     return (
          <span
               className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ring-1 ring-inset ring-transparent ${styles[status] || "bg-stone-100 text-stone-500 border-stone-200"} ${className}`}
          >
               {icons[status]}
               {label}
          </span>
     )
}

export default Orders
