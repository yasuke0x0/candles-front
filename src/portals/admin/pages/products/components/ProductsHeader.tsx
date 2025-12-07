import { Filter, Plus, Search } from "lucide-react"

interface ProductsHeaderProps {
     productsCount?: number
     isLoading: boolean
     searchTerm: string
     setSearchTerm: (val: string) => void
     viewStatus: "ACTIVE" | "ARCHIVED"
     setViewStatus: (val: "ACTIVE" | "ARCHIVED") => void
     activeFiltersCount: number
     setShowMobileFilterModal: (val: boolean) => void
     onOpenCreate: () => void
}

const ProductsHeader = ({
     productsCount,
     isLoading,
     searchTerm,
     setSearchTerm,
     viewStatus,
     setViewStatus,
     activeFiltersCount,
     setShowMobileFilterModal,
     onOpenCreate,
}: ProductsHeaderProps) => {
     return (
          <div className="w-full bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm z-30 shrink-0">
               <div className="max-w-7xl mx-auto px-4 md:px-8 py-2">
                    <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-between gap-3">
                              {/* Title Area */}
                              <div className="flex items-baseline gap-3">
                                   <h1 className="font-serif text-2xl text-stone-900 tracking-tight">Inventory</h1>
                                   {!isLoading && (
                                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider animate-in fade-in">
                                             {productsCount} Items
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
                                        placeholder="Search by name or ID..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 h-10 bg-stone-100 border-transparent focus:bg-white focus:border-stone-300 border rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-stone-100"
                                   />
                              </div>

                              <div className="flex items-center gap-2">
                                   {/* Desktop Status Toggle */}
                                   <div className="hidden md:flex p-1 bg-stone-100 rounded-lg border border-stone-200 h-10 items-center">
                                        <button
                                             onClick={() => setViewStatus("ACTIVE")}
                                             className={`px-4 h-full text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center ${
                                                  viewStatus === "ACTIVE" ? "bg-white text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-600"
                                             }`}
                                        >
                                             Active
                                        </button>
                                        <button
                                             onClick={() => setViewStatus("ARCHIVED")}
                                             className={`px-4 h-full text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center ${
                                                  viewStatus === "ARCHIVED" ? "bg-white text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-600"
                                             }`}
                                        >
                                             Archived
                                        </button>
                                   </div>

                                   {/* Filter Toggle (Mobile) */}
                                   <button
                                        onClick={() => setShowMobileFilterModal(true)}
                                        className={`md:hidden relative px-3 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                                             activeFiltersCount > 0
                                                  ? "bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-900/20"
                                                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                                        }`}
                                   >
                                        <Filter size={18} />
                                        {activeFiltersCount > 0 && (
                                             <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm border border-white">
                                                  {activeFiltersCount}
                                             </span>
                                        )}
                                   </button>

                                   {/* Create Button */}
                                   <button
                                        onClick={onOpenCreate}
                                        className="bg-stone-900 text-white px-4 h-10 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                                   >
                                        <Plus size={16} /> <span className="hidden sm:inline">Add</span>
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default ProductsHeader
