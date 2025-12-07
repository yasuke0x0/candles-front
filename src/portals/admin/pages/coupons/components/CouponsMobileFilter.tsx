import { ArrowLeft, Search } from "lucide-react"

interface CouponsMobileFilterProps {
     isOpen: boolean
     onClose: () => void
     searchTerm: string
     setSearchTerm: (val: string) => void
     statusFilter: "ALL" | "ACTIVE" | "INACTIVE"
     setStatusFilter: (val: "ALL" | "ACTIVE" | "INACTIVE") => void
     activeFiltersCount: number
     onClearFilters: () => void
}

const CouponsMobileFilter = ({ isOpen, onClose, searchTerm, setSearchTerm, statusFilter, setStatusFilter, activeFiltersCount, onClearFilters }: CouponsMobileFilterProps) => {
     if (!isOpen) return null

     return (
          <div className="fixed inset-0 z-[60] bg-stone-50 flex flex-col md:hidden animate-in slide-in-from-bottom-5 duration-300">
               <div className="bg-white px-4 py-4 border-b border-stone-200 flex items-center justify-between sticky top-0">
                    <div className="flex items-center gap-2">
                         <button onClick={onClose} className="p-2 -ml-2 text-stone-600">
                              <ArrowLeft size={20} />
                         </button>
                         <h2 className="text-lg font-serif font-bold text-stone-900">Filters</h2>
                    </div>
                    {activeFiltersCount > 0 && (
                         <button onClick={onClearFilters} className="text-xs font-bold text-red-500 uppercase tracking-wider">
                              Reset
                         </button>
                    )}
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                         <label className="text-xs font-bold uppercase text-stone-400 tracking-wider">Search</label>
                         <div className="relative">
                              <Search className="absolute left-3 top-3 text-stone-400" size={16} />
                              <input
                                   type="text"
                                   value={searchTerm}
                                   onChange={e => setSearchTerm(e.target.value)}
                                   placeholder="Search codes or description..."
                                   className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-stone-900 outline-none"
                              />
                         </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                         <label className="text-xs font-bold uppercase text-stone-400 tracking-wider">Status</label>
                         <div className="grid grid-cols-2 gap-2">
                              {(["ALL", "ACTIVE", "INACTIVE"] as const).map(status => (
                                   <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`py-3 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                                             statusFilter === status ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200"
                                        }`}
                                   >
                                        {status === "ALL" ? "All" : status === "ACTIVE" ? "Active" : "Inactive"}
                                   </button>
                              ))}
                         </div>
                    </div>
               </div>
               <div className="bg-white p-4 border-t border-stone-200">
                    <button onClick={onClose} className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl text-sm shadow-lg active:scale-95 transition-transform">
                         Show Results
                    </button>
               </div>
          </div>
     )
}

export default CouponsMobileFilter
