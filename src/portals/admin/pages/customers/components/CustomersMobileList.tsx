import { Calendar, ChevronRight, CreditCard, Package } from "lucide-react"
import { format } from "date-fns"
import type { ICustomerWithStats } from "../Customers"

interface CustomersMobileListProps {
     customers: ICustomerWithStats[]
     isLoading: boolean
     onViewDetails: (id: number) => void
}

const CustomersMobileList = ({ customers, isLoading, onViewDetails }: CustomersMobileListProps) => {
     if (isLoading) {
          return (
               <div className="md:hidden space-y-4">
                    {[1, 2, 3].map(i => (
                         <div key={i} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm animate-pulse h-32" />
                    ))}
               </div>
          )
     }

     return (
          <div className="grid grid-cols-1 gap-4 md:hidden pb-20">
               {customers.map(customer => (
                    <div
                         key={customer.id}
                         onClick={() => onViewDetails(customer.id)}
                         className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-transform flex flex-col gap-4"
                    >
                         <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold font-serif border border-stone-200">
                                        {customer.firstName?.[0] || customer.email[0].toUpperCase()}
                                   </div>
                                   <div>
                                        <h3 className="font-bold text-stone-900 text-sm">
                                             {customer.firstName ? `${customer.firstName} ${customer.lastName || ""}` : "Guest"}
                                        </h3>
                                        <p className="text-xs text-stone-400">{customer.email}</p>
                                   </div>
                              </div>
                              <ChevronRight size={16} className="text-stone-300" />
                         </div>

                         <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-50">
                              <div className="flex flex-col">
                                   <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1 flex items-center gap-1">
                                        <Package size={10} /> Orders
                                   </span>
                                   <span className="font-bold text-stone-900 text-sm">{customer.stats.totalOrders}</span>
                              </div>
                              <div className="flex flex-col text-right">
                                   <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1 flex items-center gap-1 justify-end">
                                        <CreditCard size={10} /> Spent
                                   </span>
                                   <span className="font-mono font-bold text-stone-900 text-sm">
                                        €{Number(customer.stats.totalSpent).toFixed(2)}
                                   </span>
                              </div>
                         </div>

                         <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-medium bg-stone-50 py-1.5 px-3 rounded-lg w-fit">
                              <Calendar size={10} /> Joined {format(new Date(customer.createdAt), "MMMM d, yyyy")}
                         </div>
                    </div>
               ))}
          </div>
     )
}

export default CustomersMobileList
