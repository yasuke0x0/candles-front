import { AlertCircle, ArrowRight, CheckCircle2, Package } from "lucide-react"
import { useNavigate } from "react-router-dom"

const DashboardLowStock = ({ products }: { products: any[] }) => {
     const navigate = useNavigate()

     const hasLowStock = products && products.length > 0

     return (
          <div className={`p-6 rounded-2xl border h-full flex flex-col transition-colors ${hasLowStock ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
               <div className={`flex items-center gap-2 mb-4 ${hasLowStock ? "text-red-700" : "text-emerald-700"}`}>
                    {hasLowStock ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <h3 className="font-serif text-lg">{hasLowStock ? "Low Stock Alert" : "Inventory Status"}</h3>
               </div>

               <div className="flex-1 flex flex-col justify-center space-y-3">
                    {hasLowStock ? (
                         products.map(p => (
                              <div key={p.id} className="bg-white p-3 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
                                   <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0 overflow-hidden">
                                             {p.image ? (
                                                  <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                                             ) : (
                                                  <div className="w-full h-full flex items-center justify-center text-stone-300"><Package size={16}/></div>
                                             )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                             <span className="text-xs font-bold text-stone-900 truncate max-w-[120px]">{p.name}</span>
                                             <span className="text-[10px] text-stone-400">ID: {p.id}</span>
                                        </div>
                                   </div>
                                   <div className="text-right">
                                        <span className="text-sm font-bold text-red-600 block">{p.stock} left</span>
                                   </div>
                              </div>
                         ))
                    ) : (
                         <div className="flex flex-col items-center justify-center text-center h-full gap-2 opacity-70">
                              <Package size={48} className="text-emerald-300" />
                              <p className="text-sm font-bold text-emerald-800">All products in stock</p>
                              <p className="text-xs text-emerald-600">No inventory alerts at this time.</p>
                         </div>
                    )}
               </div>

               <button
                    onClick={() => navigate("/admin/products")}
                    className={`mt-6 w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                         hasLowStock
                              ? "bg-white border border-red-200 text-red-600 hover:bg-red-100"
                              : "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                    }`}
               >
                    Manage Inventory <ArrowRight size={12} />
               </button>
          </div>
     )
}

export default DashboardLowStock
