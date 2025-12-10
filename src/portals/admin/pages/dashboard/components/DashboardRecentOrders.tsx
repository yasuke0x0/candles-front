import { format } from "date-fns"
import { ArrowUpRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { StatusBadge } from "@portals/admin/pages/orders/components/OrdersTable"

const DashboardRecentOrders = ({ orders }: { orders: any[] }) => {
     const navigate = useNavigate()

     return (
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm h-full flex flex-col">
               <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-lg text-stone-900">Recent Orders</h3>
                    <button
                         onClick={() => navigate("/admin/orders")}
                         className="text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-1"
                    >
                         View All <ArrowUpRight size={12} />
                    </button>
               </div>

               <div className="flex-1 overflow-hidden">
                    <div className="space-y-4">
                         {orders?.map(order => (
                              <div key={order.id} className="flex items-center justify-between group cursor-pointer hover:bg-stone-50 p-2 -mx-2 rounded-xl transition-colors">
                                   <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center font-bold text-xs text-stone-600 font-serif">
                                             {order.user?.firstName?.[0] || "G"}
                                        </div>
                                        <div>
                                             <div className="flex items-center gap-2">
                                                  <span className="font-bold text-stone-900 text-sm">
                                                       {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName}` : "Guest"}
                                                  </span>
                                                  <span className="text-[10px] text-stone-400">#{order.id}</span>
                                             </div>
                                             <span className="text-xs text-stone-400 block">{format(new Date(order.createdAt), "MMM d • HH:mm")}</span>
                                        </div>
                                   </div>
                                   <div className="flex flex-col items-end gap-1">
                                        <span className="font-mono font-medium text-sm">€{Number(order.totalAmount).toFixed(2)}</span>
                                        <StatusBadge status={order.status} className="scale-75 origin-right" />
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </div>
     )
}

export default DashboardRecentOrders
