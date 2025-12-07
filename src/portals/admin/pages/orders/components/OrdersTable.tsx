import { format } from "date-fns"
import { AlertCircle, Calendar, CheckCircle2, ChevronRight, Clock, Loader2, Package, Truck, XCircle } from "lucide-react"
import type { IOrderSummary } from "@portals/admin/pages/orders/Orders.tsx"

interface OrdersTableProps {
     orders: IOrderSummary[]
     isLoading: boolean
     isFetching: boolean
     hasFilters: boolean
     onClearFilters: () => void
     onOrderClick: (id: number) => void
}

const OrdersTable = ({ orders, isLoading, isFetching, hasFilters, onClearFilters, onOrderClick }: OrdersTableProps) => {
     const getCustomerName = (order: IOrderSummary) => {
          if (order.shippingAddress && (order.shippingAddress.firstName || order.shippingAddress.lastName)) {
               return `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim()
          }
          if (order.user.firstName || order.user.lastName) {
               return `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
          }
          return "Guest Customer"
     }

     if (isLoading) return <TableSkeleton />
     if (orders.length === 0) return <EmptyState onClear={onClearFilters} hasFilters={hasFilters} />

     return (
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden relative transition-all flex flex-col">
               {isFetching && (
                    <div className="absolute top-0 left-0 right-0 z-20 h-0.5 bg-stone-100 overflow-hidden">
                         <div className="h-full bg-stone-900 animate-loading-bar"></div>
                    </div>
               )}

               <div className="overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                    <table className="w-full text-left border-collapse">
                         <thead className="bg-stone-50 border-b border-stone-100 sticky top-0 z-20 shadow-sm">
                              <tr>
                                   <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 w-20">ID</th>
                                   <th className="hidden md:table-cell px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Date</th>
                                   <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Customer</th>
                                   <th className="hidden md:table-cell px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                                   <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Total</th>
                                   <th className="w-10"></th>
                              </tr>
                         </thead>
                         <tbody className="divide-y divide-stone-50">
                              {orders.map((order: IOrderSummary) => (
                                   <tr
                                        key={order.id}
                                        onClick={() => onOrderClick(order.id)}
                                        className="group hover:bg-stone-50/80 cursor-pointer transition-colors focus:outline-none focus:bg-stone-50"
                                        tabIndex={0}
                                   >
                                        <td className="px-4 py-4 align-top">
                                             <span className="font-mono font-bold text-stone-900 text-xs bg-stone-100 px-1.5 py-0.5 rounded">#{order.id}</span>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 align-top">
                                             <div className="flex flex-col">
                                                  <span className="text-xs font-medium text-stone-700">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                                                  <span className="text-[10px] text-stone-400">{format(new Date(order.createdAt), "HH:mm")}</span>
                                             </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                             <div className="flex flex-col max-w-[160px] md:max-w-none">
                                                  <span className="text-sm font-bold text-stone-900 truncate">{getCustomerName(order)}</span>
                                                  <span className="text-[11px] text-stone-500 truncate">{order.user?.email}</span>
                                                  <div className="md:hidden mt-2 flex flex-col items-start gap-1">
                                                       <StatusBadge status={order.status} className="px-1.5 py-0.5 text-[9px]" />
                                                       <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            {format(new Date(order.createdAt), "MMMM d, yyyy • HH:mm")}
                                                       </span>
                                                  </div>
                                             </div>
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-4 align-top">
                                             <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-4 py-4 align-top text-right">
                                             <div className="flex flex-col items-end gap-1">
                                                  <div className="font-serif text-stone-900 text-sm font-medium">€{Number(order.totalAmount).toFixed(2)}</div>
                                                  <div className="text-[10px] text-stone-400">{order.items.length} items</div>
                                             </div>
                                        </td>
                                        <td className="px-2 py-4 align-middle text-stone-300">
                                             <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2" />
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>
          </div>
     )
}

// --- SUB COMPONENTS ---

export const StatusBadge = ({ status, className = "" }: { status: string; className?: string }) => {
     const styles: Record<string, string> = {
          created: "bg-stone-100 text-stone-600 border-stone-200",
          succeeded: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
          READY_TO_SHIP: "bg-violet-50 text-violet-700 border-violet-200 ring-violet-100",
          SHIPPED: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
          canceled: "bg-red-50 text-red-700 border-red-200 ring-red-100",
          processing: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
          requires_action: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-100",
     }

     const icons: Record<string, React.ReactNode> = {
          created: <Clock size={10} />,
          succeeded: <CheckCircle2 size={10} />,
          READY_TO_SHIP: <Package size={10} />,
          SHIPPED: <Truck size={10} />,
          canceled: <XCircle size={10} />,
          processing: <Loader2 size={10} className="animate-spin" />,
          requires_action: <AlertCircle size={10} />,
     }

     const label = status === "succeeded" ? "PAID" : status.replace(/_/g, " ")

     return (
          <span
               className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ring-1 ring-inset ring-transparent ${
                    styles[status] || "bg-stone-100 text-stone-500 border-stone-200"
               } ${className}`}
          >
               {icons[status]}
               {label}
          </span>
     )
}

const TableSkeleton = () => (
     <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-100 p-4">
               <div className="flex justify-between items-center">
                    <div className="h-3 w-12 bg-stone-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-stone-200 rounded animate-pulse" />
               </div>
          </div>
          <div className="divide-y divide-stone-50">
               {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between animate-pulse">
                         <div className="space-y-2">
                              <div className="h-4 w-10 bg-stone-100 rounded" />
                              <div className="h-3 w-24 bg-stone-50 rounded" />
                         </div>
                         <div className="h-6 w-20 bg-stone-100 rounded-full" />
                         <div className="space-y-2 text-right">
                              <div className="h-4 w-16 bg-stone-100 rounded ml-auto" />
                              <div className="h-3 w-8 bg-stone-50 rounded ml-auto" />
                         </div>
                    </div>
               ))}
          </div>
     </div>
)

const EmptyState = ({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) => (
     <div className="bg-white border border-stone-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-2">
               <Package size={24} />
          </div>
          <h3 className="text-base font-serif font-medium text-stone-900">No orders found</h3>
          <p className="text-stone-400 text-xs max-w-xs mx-auto">We couldn't find any orders matching your current filters.</p>
          {hasFilters && (
               <button
                    onClick={onClear}
                    className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-red-600 border-b border-stone-200 hover:border-red-200 pb-0.5 transition-colors"
               >
                    Clear Filters
               </button>
          )}
     </div>
)

export default OrdersTable
