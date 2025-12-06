import { Loader2 } from "lucide-react"

const AdminLoader = () => {
     return (
          <div className="h-full w-full min-h-[400px] flex flex-col items-center justify-center bg-stone-50/50 backdrop-blur-sm transition-all duration-500">
               <div className="relative">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-stone-200"></div>

                    {/* Spinning Ring */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-stone-900 animate-spin"></div>

                    {/* Icon */}
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white shadow-sm z-10 relative">
                         <Loader2 className="w-5 h-5 text-stone-900 animate-pulse" />
                    </div>
               </div>
               <span className="mt-4 text-xs font-bold uppercase tracking-widest text-stone-400 animate-pulse">Loading Dashboard...</span>
          </div>
     )
}

export default AdminLoader
