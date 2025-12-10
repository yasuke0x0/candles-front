import { Search, Users } from "lucide-react"

interface CustomersHeaderProps {
     totalCustomers?: number
     isLoading: boolean
     searchTerm: string
     setSearchTerm: (val: string) => void
}

const CustomersHeader = ({ totalCustomers, isLoading, searchTerm, setSearchTerm }: CustomersHeaderProps) => {
     return (
          <div className="w-full bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm z-30 shrink-0">
               <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         {/* Title & Count */}
                         <div className="flex items-baseline gap-3">
                              <h1 className="font-serif text-2xl text-stone-900 tracking-tight">Customers</h1>
                              {!isLoading && totalCustomers !== undefined && (
                                   <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider animate-in fade-in">
                                        <Users size={12} /> {totalCustomers} Registered
                                   </span>
                              )}
                         </div>

                         {/* Search Bar */}
                         <div className="flex-1 max-w-md relative group">
                              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                   <Search className="text-stone-400 group-focus-within:text-stone-800 transition-colors" size={16} />
                              </div>
                              <input
                                   type="text"
                                   placeholder="Search by name or email..."
                                   value={searchTerm}
                                   onChange={e => setSearchTerm(e.target.value)}
                                   className="w-full pl-10 pr-4 h-10 bg-stone-100 border-transparent focus:bg-white focus:border-stone-300 border rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-stone-100"
                              />
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default CustomersHeader
