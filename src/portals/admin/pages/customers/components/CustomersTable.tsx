import { format } from "date-fns"
import { ChevronRight, Package, User as UserIcon } from "lucide-react"
import type { ICustomerWithStats } from "../Customers"

interface CustomersTableProps {
     customers: ICustomerWithStats[]
     isLoading: boolean
     onViewDetails: (id: number) => void
}

const CustomersTable = ({ customers, isLoading, onViewDetails }: CustomersTableProps) => {
     if (isLoading) return <TableSkeleton />

     if (customers.length === 0) return <EmptyState />

     return (
          <div className="hidden md:block bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left border-collapse">
                    <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                         <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-500">Customer</th>
                         <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-center">Orders</th>
                         <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">Lifetime Spent</th>
                         <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">Joined</th>
                         <th className="w-10"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                    {customers.map(customer => (
                         <tr
                              key={customer.id}
                              onClick={() => onViewDetails(customer.id)}
                              className="group hover:bg-stone-50/80 transition-colors cursor-pointer"
                         >
                              <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 font-bold font-serif">
                                             {customer.firstName?.[0] || customer.email[0].toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                             <span className="font-bold text-stone-900 text-sm">
                                                  {customer.firstName ? `${customer.firstName} ${customer.lastName || ""}` : "Guest"}
                                             </span>
                                             <span className="text-xs text-stone-400">{customer.email}</span>
                                        </div>
                                   </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                   <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 text-xs font-bold">
                                        <Package size={12} /> {customer.stats.totalOrders}
                                   </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                   <span className="font-mono font-medium text-stone-900">
                                        €{Number(customer.stats.totalSpent).toFixed(2)}
                                   </span>
                              </td>
                              <td className="px-6 py-4 text-right text-xs text-stone-500">
                                   {format(new Date(customer.createdAt), "MMM d, yyyy")}
                              </td>
                              <td className="px-2 py-4 text-stone-300">
                                   <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </td>
                         </tr>
                    ))}
                    </tbody>
               </table>
          </div>
     )
}

// --- SKELETON & EMPTY STATES ---

const EmptyState = () => (
     <div className="bg-white border border-stone-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
               <UserIcon size={32} />
          </div>
          <div>
               <h3 className="text-lg font-serif text-stone-900">No customers found</h3>
               <p className="text-stone-400 text-sm mt-1">Try adjusting your search.</p>
          </div>
     </div>
)

const TableSkeleton = () => (
     <div className="hidden md:block bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-100 p-4 h-10" />
          <div className="divide-y divide-stone-50">
               {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between animate-pulse">
                         <div className="flex items-center gap-3 w-1/3">
                              <div className="w-9 h-9 bg-stone-100 rounded-full" />
                              <div className="space-y-2 flex-1">
                                   <div className="h-4 w-24 bg-stone-100 rounded" />
                                   <div className="h-3 w-32 bg-stone-50 rounded" />
                              </div>
                         </div>
                         <div className="h-6 w-12 bg-stone-100 rounded" />
                         <div className="h-4 w-20 bg-stone-100 rounded" />
                         <div className="h-4 w-24 bg-stone-100 rounded" />
                    </div>
               ))}
          </div>
     </div>
)

export default CustomersTable
