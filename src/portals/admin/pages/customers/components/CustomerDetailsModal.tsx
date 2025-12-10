import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { ChevronRight, Loader2, Mail, MapPin, Phone, ShoppingBag, X } from "lucide-react"
import Cursor from "@components/Cursor"
import { StatusBadge } from "@portals/admin/pages/orders/components/OrdersTable"
import OrderDetailsModal from "@portals/admin/pages/orders/components/OrderDetailsModal"
import { CUSTOMER_DETAILS_ENDPOINT } from "@api-endpoints"

interface CustomerDetailsModalProps {
     customerId: number | null
     onClose: () => void
}

const CustomerDetailsModal = ({ customerId, onClose }: CustomerDetailsModalProps) => {
     const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

     // Handle Escape Key
     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.key === "Escape" && !selectedOrderId) {
                    onClose()
               }
          }
          if (customerId) {
               window.addEventListener("keydown", handleKeyDown)
               document.body.style.overflow = "hidden"
          }
          return () => {
               window.removeEventListener("keydown", handleKeyDown)
               document.body.style.overflow = "unset"
          }
     }, [customerId, onClose, selectedOrderId])

     // Fetch Full Details
     const { data: customer, isLoading } = useQuery({
          queryKey: ["admin-customer-detail", customerId],
          queryFn: async () => {
               if (!customerId) return null
               const res = await axios.get(CUSTOMER_DETAILS_ENDPOINT(customerId))
               return res.data
          },
          enabled: !!customerId,
     })

     if (!customerId) return null

     return createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end font-sans">
               <Cursor />

               {/* Backdrop - Simple Fade */}
               <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px]"
                    onClick={onClose}
               />

               {/* Drawer - Simple Slide (No Laggy Spring) */}
               <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth & Fast
                    className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-100"
               >
                    {/* Header */}
                    <div className="px-6 md:px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white/80 backdrop-blur z-10 sticky top-0">
                         <div>
                              <h2 className="font-serif text-2xl text-stone-900 tracking-tight">Customer Profile</h2>
                              <p className="text-xs text-stone-400 uppercase tracking-widest mt-1 font-medium">ID: #{customerId}</p>
                         </div>
                         <button onClick={onClose} className="p-2 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors border border-stone-100">
                              <X size={20} className="text-stone-400" />
                         </button>
                    </div>

                    {isLoading || !customer ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-4">
                              <Loader2 className="animate-spin" size={32} />
                              <span className="text-xs font-bold uppercase tracking-widest">Loading Profile...</span>
                         </div>
                    ) : (
                         <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin">

                              {/* 1. Identity Card (Responsive) */}
                              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                                   {/* Avatar */}
                                   <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow-sm text-2xl flex items-center justify-center font-serif text-stone-600 shrink-0">
                                        {customer.firstName?.[0] || "G"}
                                   </div>

                                   {/* Info Area */}
                                   <div className="flex-1 w-full text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-stone-900">
                                             {customer.firstName} {customer.lastName}
                                        </h3>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-stone-500 mt-1 break-all">
                                             <Mail size={14} className="shrink-0" /> {customer.email}
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mt-5 w-full sm:w-auto">
                                             <div className="px-4 py-2.5 bg-white rounded-xl shadow-sm border border-stone-100 text-center min-w-[100px]">
                                                  <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">Orders</span>
                                                  <span className="text-lg font-bold text-stone-900">{customer.stats.totalOrders}</span>
                                             </div>
                                             <div className="px-4 py-2.5 bg-white rounded-xl shadow-sm border border-stone-100 text-center min-w-[100px]">
                                                  <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">Spent</span>
                                                  <span className="text-lg font-mono text-emerald-600">€{Number(customer.stats.totalSpent).toFixed(2)}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* 2. Addresses */}
                              <div>
                                   <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4 flex items-center gap-2">
                                        <MapPin size={14} /> Saved Addresses
                                   </h4>
                                   {customer.addresses.length === 0 ? (
                                        <div className="text-sm text-stone-400 italic bg-stone-50 p-4 rounded-xl text-center">No addresses saved.</div>
                                   ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                             {customer.addresses.map((addr: any) => (
                                                  <div
                                                       key={addr.id}
                                                       className="p-4 rounded-xl border border-stone-200 text-sm relative group hover:border-stone-300 transition-colors bg-white"
                                                  >
                                                       <span className="absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 bg-stone-100 rounded text-stone-500 uppercase border border-stone-200">
                                                            {addr.type}
                                                       </span>
                                                       <p className="font-bold text-stone-900 mb-1">
                                                            {addr.firstName} {addr.lastName}
                                                       </p>
                                                       <p className="text-stone-600">{addr.streetAddressLineOne}</p>
                                                       <p className="text-stone-600">
                                                            {addr.city}, {addr.postalCode}
                                                       </p>
                                                       <p className="text-stone-400 text-xs font-bold uppercase mt-1">{addr.country}</p>
                                                       {addr.phone && (
                                                            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-2 text-stone-500 text-xs">
                                                                 <Phone size={10} /> {addr.phonePrefix} {addr.phone}
                                                            </div>
                                                       )}
                                                  </div>
                                             ))}
                                        </div>
                                   )}
                              </div>

                              {/* 3. Recent Orders */}
                              <div>
                                   <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4 flex items-center gap-2">
                                        <ShoppingBag size={14} /> Recent Orders
                                   </h4>
                                   <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                                        {customer.orders?.map((order: any) => (
                                             <div
                                                  key={order.id}
                                                  onClick={() => setSelectedOrderId(order.id)} // Open Order Details
                                                  className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer group"
                                             >
                                                  <div className="flex flex-col gap-1">
                                                       <div className="flex items-center gap-2">
                                                            <span className="font-mono text-sm font-bold text-stone-900 group-hover:text-blue-600 transition-colors">
                                                                 #{order.id}
                                                            </span>
                                                            <StatusBadge status={order.status} className="scale-75 origin-left" />
                                                       </div>
                                                       <span className="text-xs text-stone-400">{format(new Date(order.createdAt), "MMM d, yyyy • HH:mm")}</span>
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                       <div className="text-right">
                                                            <span className="block font-medium text-stone-900">€{Number(order.totalAmount).toFixed(2)}</span>
                                                            <span className="text-xs text-stone-500">{order.items?.length || 0} items</span>
                                                       </div>
                                                       <ChevronRight size={16} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
                                                  </div>
                                             </div>
                                        ))}
                                        {(!customer.orders || customer.orders.length === 0) && <div className="p-8 text-center text-stone-400 text-sm">No orders yet.</div>}
                                   </div>
                              </div>
                         </div>
                    )}
               </motion.div>

               {/* Nested Order Details Modal */}
               {selectedOrderId && <OrderDetailsModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />}
          </div>,
          document.body
     )
}

export default CustomerDetailsModal
