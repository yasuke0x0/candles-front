import { useEffect } from "react"
import { createPortal } from "react-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import {
     CheckCircle,
     CreditCard,
     ExternalLink,
     Loader2,
     Mail,
     MapPin,
     Package,
     Receipt,
     Truck,
     X,
} from "lucide-react"
import { format } from "date-fns"
import Cursor from "@components/Cursor"
import { ORDER_DETAILS_ENDPOINT } from "@api-endpoints"

interface OrderDetailsModalProps {
     orderId: number | null
     onClose: () => void
}

const OrderDetailsModal = ({ orderId, onClose }: OrderDetailsModalProps) => {
     const queryClient = useQueryClient()

     // 1. Handle Escape Key
     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.key === "Escape") onClose()
          }
          if (orderId) {
               window.addEventListener("keydown", handleKeyDown)
               document.body.style.overflow = "hidden"
          }
          return () => {
               window.removeEventListener("keydown", handleKeyDown)
               document.body.style.overflow = "unset"
          }
     }, [orderId, onClose])

     // 2. Fetch Deep Details
     const { data: order, isLoading } = useQuery({
          queryKey: ["admin-order-detail", orderId],
          queryFn: async () => {
               const res = await axios.get(ORDER_DETAILS_ENDPOINT(orderId!))
               // Handle different API wrapper structures
               return res.data.data || res.data
          },
          enabled: !!orderId,
     })

     // 3. Status Mutation
     const statusMutation = useMutation({
          mutationFn: (newStatus: string) => axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus }),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
               queryClient.invalidateQueries({ queryKey: ["admin-order-detail", orderId] })
          },
     })

     // --- HELPERS ---

     const getGoogleMapsUrl = (addr: any) => {
          if (!addr) return "#"
          const query = `${addr.streetAddressLineOne}, ${addr.city}, ${addr.postalCode}, ${addr.country}`
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
     }

     const areAddressesEqual = (a1: any, a2: any) => {
          if (!a1 || !a2) return false
          return (
               a1.firstName === a2.firstName &&
               a1.lastName === a2.lastName &&
               a1.streetAddressLineOne === a2.streetAddressLineOne &&
               a1.city === a2.city &&
               a1.postalCode === a2.postalCode &&
               a1.country === a2.country
          )
     }

     if (!orderId) return null

     const isBillingSame = order ? areAddressesEqual(order.shippingAddress, order.billingAddress) : false

     return createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end font-sans">
               <Cursor />

               {/* Backdrop */}
               <div
                    className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
                    onClick={onClose}
               />

               {/* Slide-over Panel */}
               <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-100">

                    {/* Header */}
                    <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white/80 backdrop-blur z-10 sticky top-0">
                         <div>
                              <div className="flex items-center gap-3">
                                   <h2 className="font-serif text-2xl text-stone-900 tracking-tight">Order #{orderId}</h2>
                                   {order?.status && (
                                        <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider rounded border border-stone-200">
                                             {order.status.replace(/_/g, " ")}
                                        </span>
                                   )}
                              </div>
                              <p className="text-xs text-stone-400 uppercase tracking-widest mt-1 font-medium">
                                   {order ? format(new Date(order.createdAt), "MMMM d, yyyy • HH:mm") : "Loading..."}
                              </p>
                         </div>
                         <button onClick={onClose} className="p-2 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors border border-stone-100">
                              <X size={20} className="text-stone-400" />
                         </button>
                    </div>

                    {isLoading || !order ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-4">
                              <Loader2 className="animate-spin" size={32} />
                              <span className="text-xs font-bold uppercase tracking-widest">Fetching Details...</span>
                         </div>
                    ) : (
                         <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">

                              {/* --- ADDRESSES GRID --- */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                   {/* Left Column: Customer & Billing (if different) */}
                                   <div className="space-y-6">
                                        {/* Customer Info */}
                                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 h-fit">
                                             <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4 flex items-center gap-2">
                                                  <Mail size={12} /> Customer
                                             </h4>
                                             <div className="flex items-center gap-3 mb-3">
                                                  <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-serif font-bold">
                                                       {order.user.firstName ? order.user.firstName[0] : "?"}
                                                  </div>
                                                  <div>
                                                       <p className="font-bold text-stone-900 text-sm">
                                                            {order.user.firstName || "Guest"} {order.user.lastName || ""}
                                                       </p>
                                                       <p className="text-xs text-stone-500">{order.user.email}</p>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Billing Address - Only show if different */}
                                        {!isBillingSame && order.billingAddress && (
                                             <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                                                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-orange-400 mb-4 flex items-center gap-2">
                                                       <Receipt size={12} /> Billing Address
                                                  </h4>
                                                  <div className="text-sm text-stone-600 space-y-0.5">
                                                       <p className="font-bold text-stone-900">
                                                            {order.billingAddress.firstName} {order.billingAddress.lastName}
                                                       </p>
                                                       <p>{order.billingAddress.streetAddressLineOne}</p>
                                                       {order.billingAddress.streetAddressLineTwo && <p>{order.billingAddress.streetAddressLineTwo}</p>}
                                                       <p>
                                                            {order.billingAddress.city}, {order.billingAddress.postalCode}
                                                       </p>
                                                       <p className="uppercase text-xs font-bold mt-1 text-stone-400">{order.billingAddress.country}</p>
                                                  </div>
                                             </div>
                                        )}
                                   </div>

                                   {/* Right Column: Shipping Info */}
                                   <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                             <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 flex items-center gap-2">
                                                  <Truck size={12} /> Shipping To
                                             </h4>
                                             {/* Google Maps Link */}
                                             <a
                                                  href={getGoogleMapsUrl(order.shippingAddress)}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                             >
                                                  <MapPin size={10} /> Open Map
                                             </a>
                                        </div>

                                        <div className="text-sm text-stone-600 space-y-0.5 flex-1">
                                             <p className="font-bold text-stone-900">
                                                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                             </p>
                                             <p>{order.shippingAddress.streetAddressLineOne}</p>
                                             {order.shippingAddress.streetAddressLineTwo && <p>{order.shippingAddress.streetAddressLineTwo}</p>}
                                             <p>
                                                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                             </p>
                                             <p className="uppercase text-xs font-bold mt-1 text-stone-400">{order.shippingAddress.country}</p>
                                        </div>

                                        {/* Billing Match Indicator */}
                                        {isBillingSame && (
                                             <div className="mt-4 pt-4 border-t border-stone-200/50">
                                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                                       <CheckCircle size={10} /> Billing address same as shipping
                                                  </span>
                                             </div>
                                        )}
                                   </div>
                              </div>

                              {/* --- ORDER ITEMS --- */}
                              <div>
                                   <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4 flex items-center gap-2">
                                        <Package size={12} /> Order Items
                                   </h4>
                                   <div className="border border-stone-100 rounded-2xl overflow-hidden divide-y divide-stone-50">
                                        {order.items.map((item: any) => (
                                             <div key={item.id} className="p-4 bg-white flex items-center gap-4">
                                                  <div className="w-12 h-12 bg-stone-100 rounded-lg shrink-0 overflow-hidden">
                                                       {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" alt={item.productName} />}
                                                  </div>
                                                  <div className="flex-1">
                                                       <p className="font-bold text-stone-900 text-sm">{item.productName}</p>
                                                       <p className="text-xs text-stone-400">SKU: {item.productId}</p>
                                                  </div>
                                                  <div className="text-right">
                                                       <p className="font-mono text-sm text-stone-900">€{Number(item.price).toFixed(2)}</p>
                                                       <p className="text-xs text-stone-500">Qty: {item.quantity}</p>

                                                       {/* Per Item Discount */}
                                                       {Number(item.discountAmount) > 0 && (
                                                            <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                                                                 -€{Number(item.discountAmount).toFixed(2)} Off
                                                            </p>
                                                       )}
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              {/* --- FINANCIAL SUMMARY --- */}
                              <div className="bg-stone-900 text-stone-200 p-6 rounded-2xl relative overflow-hidden shadow-lg">
                                   <div className="space-y-3 text-sm relative z-10">
                                        <div className="flex justify-between">
                                             <span className="text-stone-400">Subtotal (Excl. VAT)</span>
                                             <span>€{Number(order.amountWithoutVat).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span className="text-stone-400">Shipping</span>
                                             <span>€{Number(order.shippingAmount).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span className="text-stone-400">VAT</span>
                                             <span>€{Number(order.vatAmount).toFixed(2)}</span>
                                        </div>

                                        {/* Global/Coupon Discount */}
                                        {(Number(order.totalDiscount) > 0 || Number(order.couponDiscountAmount) > 0) && (
                                             <div className="flex justify-between text-emerald-400 font-medium">
                                                  <span className="flex items-center gap-2">
                                                       Discount
                                                       {order.coupon && <span className="bg-emerald-400/10 px-1.5 py-0.5 rounded text-[10px] border border-emerald-400/20">{order.coupon.code}</span>}
                                                  </span>
                                                  <span>-€{Math.max(Number(order.totalDiscount), Number(order.couponDiscountAmount)).toFixed(2)}</span>
                                             </div>
                                        )}

                                        <div className="h-px bg-stone-800 my-2" />

                                        <div className="flex justify-between font-serif text-xl text-white">
                                             <span>Total</span>
                                             <span>€{Number(order.totalAmount).toFixed(2)}</span>
                                        </div>

                                        {/* Stripe Link */}
                                        {order.paymentIntentId && (
                                             <div className="mt-4 pt-4 border-t border-stone-800 flex justify-end">
                                                  <a
                                                       href={`https://dashboard.stripe.com/payments/${order.paymentIntentId}`}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-white transition-colors flex items-center gap-1.5"
                                                  >
                                                       <CreditCard size={12} /> View Payment on Stripe <ExternalLink size={10} />
                                                  </a>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Footer Actions */}
                    {order && (
                         <div className="px-8 py-6 border-t border-stone-100 bg-stone-50 flex gap-4 items-center justify-end shrink-0">
                              {order.status === "created" && (
                                   <button
                                        onClick={() => statusMutation.mutate("SHIPPED")}
                                        disabled={statusMutation.isPending}
                                        className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-stone-800 transition-all flex items-center gap-2 shadow-lg shadow-stone-900/10 active:scale-95"
                                   >
                                        {statusMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Truck size={16} />}
                                        Mark as Shipped
                                   </button>
                              )}
                              {order.status === "SHIPPED" && (
                                   <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider px-4 bg-emerald-50 py-2 rounded-lg border border-emerald-100">
                                        <CheckCircle size={16} /> Order Fulfilled
                                   </div>
                              )}
                         </div>
                    )}
               </div>
          </div>,
          document.body
     )
}

export default OrderDetailsModal
