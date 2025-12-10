import { Trophy, Package } from "lucide-react"

const DashboardTopProducts = ({ products }: { products: any[] }) => {
     return (
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm h-full">
               <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-lg text-stone-900">Top Products</h3>
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                         <Trophy size={18} />
                    </div>
               </div>

               <div className="space-y-4">
                    {products?.map((product, i) => (
                         <div key={i} className="flex items-center gap-4 group">
                              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                   i === 0 ? "bg-amber-100 text-amber-700" :
                                        i === 1 ? "bg-stone-200 text-stone-600" :
                                             i === 2 ? "bg-orange-100 text-orange-700" : "bg-stone-50 text-stone-400"
                              }`}>
                                   {i + 1}
                              </div>

                              <div className="w-12 h-12 rounded-xl bg-stone-50 shrink-0 overflow-hidden border border-stone-100">
                                   {product.image ? (
                                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.productName} />
                                   ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-300"><Package size={16}/></div>
                                   )}
                              </div>

                              <div className="flex-1 min-w-0">
                                   <h4 className="text-sm font-bold text-stone-900 truncate">{product.productName}</h4>
                                   <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                             <div
                                                  className="h-full bg-stone-900 rounded-full"
                                                  style={{ width: `${Math.max(5, Math.min(100, (Number(product.totalRevenue) / (Number(products[0].totalRevenue) || 1)) * 100))}%` }}
                                             />
                                        </div>
                                   </div>
                              </div>

                              <div className="text-right">
                                   <span className="block font-bold text-stone-900 text-sm">
                                        €{Number(product.totalRevenue).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                   </span>
                                   <span className="text-xs text-stone-400">{product.totalSold} sold</span>
                              </div>
                         </div>
                    ))}
                    {!products?.length && (
                         <div className="h-40 flex flex-col items-center justify-center text-stone-400 gap-2">
                              <Package size={24} className="opacity-20" />
                              <span className="text-sm italic">No sales data for this period.</span>
                         </div>
                    )}
               </div>
          </div>
     )
}

export default DashboardTopProducts
