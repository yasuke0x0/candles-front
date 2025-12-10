import { CalendarDays, Filter } from "lucide-react"
import { useState, useEffect } from "react"

interface DashboardHeaderProps {
     dateRange: { start: string; end: string }
     setDateRange: (range: { start: string; end: string }) => void
     isScrolled: boolean // New Prop
}

const DashboardHeader = ({ dateRange, setDateRange, isScrolled }: DashboardHeaderProps) => {
     // Local state for inputs (not applied yet)
     const [localRange, setLocalRange] = useState(dateRange)

     // Sync local state if parent updates
     useEffect(() => {
          setLocalRange(dateRange)
     }, [dateRange])

     const handleApply = () => {
          setDateRange(localRange)
     }

     return (
          <div
               className={`w-full bg-white/90 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-30 transition-all duration-300 ease-in-out ${
                    // REDUCED PADDING: py-3 (default) and py-2 (scrolled)
                    isScrolled ? "py-2 px-6 shadow-sm bg-white/95" : "py-3 px-8"
               }`}
          >
               <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    {/* Title Section */}
                    <div className={`transition-all duration-300 origin-left ${isScrolled ? "scale-95" : ""}`}>
                         <h1 className={`font-serif text-stone-900 tracking-tight transition-all duration-300 ${isScrolled ? "text-xl" : "text-2xl"}`}>
                              Overview
                         </h1>
                    </div>

                    {/* Date Picker Section */}
                    <div className={`flex items-center gap-2 transition-all duration-300 ${isScrolled ? "scale-95 origin-right" : ""}`}>
                         <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-200 shadow-sm transition-all hover:border-stone-300">
                              <div className="flex items-center gap-2 px-3 py-1.5 border-r border-stone-200 text-stone-500">
                                   <CalendarDays size={14} />
                                   <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Period</span>
                              </div>
                              <input
                                   type="date"
                                   value={localRange.start}
                                   onChange={(e) => setLocalRange({ ...localRange, start: e.target.value })}
                                   className="bg-transparent text-xs font-bold text-stone-900 focus:outline-none p-1 cursor-pointer w-24 md:w-auto"
                              />
                              <span className="text-stone-300 text-xs font-bold">-</span>
                              <input
                                   type="date"
                                   value={localRange.end}
                                   onChange={(e) => setLocalRange({ ...localRange, end: e.target.value })}
                                   className="bg-transparent text-xs font-bold text-stone-900 focus:outline-none p-1 cursor-pointer w-24 md:w-auto"
                              />
                         </div>

                         {/* Apply Button */}
                         <button
                              onClick={handleApply}
                              className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-all active:scale-95 shadow-md flex items-center gap-2 h-[38px]"
                         >
                              <Filter size={12} /> <span className="hidden sm:inline">Apply</span>
                         </button>
                    </div>
               </div>
          </div>
     )
}

export default DashboardHeader
