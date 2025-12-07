import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface IMeta {
     currentPage: number
     firstPage: number
     lastPage: number
     perPage: number
     total: number
}

interface OrdersPaginationProps {
     meta?: IMeta
     limit: number
     setLimit: (val: number) => void
     setPage: (val: number | ((prev: number) => number)) => void
     pageSizeOptions: number[]
}

const OrdersPagination = ({ meta, limit, setLimit, setPage, pageSizeOptions }: OrdersPaginationProps) => {
     if (!meta || meta.lastPage <= 1) return null

     const getPageNumbers = () => {
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
                              {pageSizeOptions.map(opt => (
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
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                             meta.currentPage === pageNum
                                                  ? "bg-stone-900 text-white shadow-md"
                                                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                                        }`}
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
     )
}

export default OrdersPagination
