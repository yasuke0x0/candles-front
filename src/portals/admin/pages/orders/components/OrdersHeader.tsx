import { Calendar, Filter, RotateCcw, Search, X, XCircle } from "lucide-react"

interface OrdersHeaderProps {
     totalOrders?: number
     isLoading: boolean
     searchTerm: string
     setSearchTerm: (val: string) => void
     activeFiltersCount: number
     clearFilters: () => void
     showDesktopFilters: boolean
     setShowDesktopFilters: (val: boolean) => void
     setShowMobileFilterModal: (val: boolean) => void
     statusFilter: string
     setStatusFilter: (val: string) => void
     startDate: string
     setStartDate: (val: string) => void
     endDate: string
     setEndDate: (val: string) => void
     tabs: { label: string; value: string }[]
}

const OrdersHeader = ({
                           totalOrders,
                           isLoading,
                           searchTerm,
                           setSearchTerm,
                           activeFiltersCount,
                           clearFilters,
                           showDesktopFilters,
                           setShowDesktopFilters,
                           setShowMobileFilterModal,
                           statusFilter,
                           setStatusFilter,
                           startDate,
                           setStartDate,
                           endDate,
                           setEndDate,
                           tabs,
                      }: OrdersHeaderProps) => {
     return (
          <div className="w-full bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm z-30 shrink-0">
               <div className="max-w-7xl mx-auto px-4 md:px-8 py-2">
                    {/* FIXED: Removed gap-3 to prevent bottom spacing when drawer is closed */}
                    <div className="flex flex-col">
                         <div className="flex items-center justify-between gap-3">
                              {/* Title Area */}
                              <div className="flex items-baseline gap-3">
                                   <h1 className="font-serif text-2xl text-stone-900 tracking-tight">Orders</h1>
                                   {!isLoading && totalOrders !== undefined && (
                                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider animate-in fade-in">
                                             {totalOrders} Total
                                        </span>
                                   )}
                              </div>

                              {/* Search Bar (Desktop) */}
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

                              {/* Actions */}
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
                              className={`hidden md:block overflow-hidden transition-all duration-300 ease-in-out ${
                                   // Added mt-3 here to replace parent gap, only when open
                                   showDesktopFilters ? "max-h-24 opacity-100 mt-3 pb-2" : "max-h-0 opacity-0"
                              }`}
                         >
                              <div className="flex items-center justify-between gap-4">
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
     )
}

export default OrdersHeader
