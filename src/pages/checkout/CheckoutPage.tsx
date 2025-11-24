import React, { useContext, useState } from "react"
import { ChevronLeft, CreditCard, Lock, ShieldCheck } from "lucide-react"
import { AppContext } from "../../app/App.tsx"
import { useNavigate } from "react-router-dom"
import { CART_STORAGE_KEY } from "@constants"

const CheckoutPage = () => {
     const navigate = useNavigate()
     const { cartItems: items, setCartItems } = useContext(AppContext)

     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

     const [formData, setFormData] = useState({
          email: "",
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          zip: "",
          country: "United States",
     })

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          onCompleteOrder(formData)
     }

     const shipping = 15.0
     const finalTotal = total + shipping

     const onCompleteOrder = (details: any) => {
          console.log("Order Placed:", details)
          setCartItems([]) // Clear state
          localStorage.removeItem(CART_STORAGE_KEY) // Clear storage
          navigate("/")
          alert("Thank you for your order!")
     }

     return (
          <div className="min-h-screen bg-white lg:flex">
               {/* LEFT COLUMN: Forms */}
               <div className="flex-1 px-6 py-12 md:px-12 lg:px-24 overflow-y-auto">
                    {/* Header / Back Link */}
                    <div className="max-w-xl mx-auto mb-10">
                         <button
                              onClick={() => navigate("/cart")}
                              className="flex items-center text-xs uppercase tracking-widest font-bold text-stone-500 hover:text-stone-900 transition-colors mb-8 group"
                         >
                              <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                              Return to Cart
                         </button>

                         <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Checkout</h1>
                         <div className="flex items-center gap-2 text-stone-400 text-sm">
                              <ShieldCheck size={16} />
                              <span>Secure SSL Encrypted Transaction</span>
                         </div>
                    </div>

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-12">
                         {/* ... (Contact & Shipping Sections remain unchanged) ... */}
                         <section>
                              <div className="space-y-4">
                                   <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                   />
                                   <div className="flex items-center gap-2">
                                        <input type="checkbox" id="newsletter" className="rounded border-stone-300 text-stone-900 focus:ring-stone-500" />
                                        <label htmlFor="newsletter" className="text-sm text-stone-600">
                                             Subscribe and receive 10% off your next order
                                        </label>
                                   </div>
                              </div>
                         </section>

                         <section>
                              <h2 className="text-lg font-serif text-stone-900 mb-6">Shipping Address</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <Input
                                        label="First Name"
                                        placeholder="Jane"
                                        required
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                   />
                                   <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        required
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                   />
                                   <div className="md:col-span-2">
                                        <Input
                                             label="Address"
                                             placeholder="123 Artisan Avenue"
                                             required
                                             value={formData.address}
                                             onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                   </div>
                                   <div className="md:col-span-2">
                                        <Input label="Apartment, suite, etc. (optional)" placeholder="" />
                                   </div>
                                   <Input label="City" placeholder="New York" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                   <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                             <label className="text-xs uppercase tracking-wider font-bold text-stone-500">Country</label>
                                             <select className="w-full px-4 py-3 bg-transparent border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900 transition-colors">
                                                  <option>United States</option>
                                                  <option>France</option>
                                                  <option>Canada</option>
                                             </select>
                                        </div>
                                        <Input
                                             label="ZIP / Postal"
                                             placeholder="10001"
                                             required
                                             value={formData.zip}
                                             onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                        />
                                   </div>
                              </div>
                         </section>

                         {/* Payment Section */}
                         <section>
                              <h2 className="text-lg font-serif text-stone-900 mb-6">Payment</h2>
                              <div className="border border-stone-200 rounded-lg overflow-hidden p-6 bg-stone-50/50">
                                   <div className="flex items-center justify-between mb-6">
                                        <span className="text-sm font-bold text-stone-700">Credit Card</span>
                                        <div className="flex gap-2">
                                             <CreditCard size={20} className="text-stone-400" />
                                        </div>
                                   </div>
                                   <div className="space-y-4">
                                        <Input label="Card Number" placeholder="0000 0000 0000 0000" icon={<Lock size={14} />} />
                                        <div className="grid grid-cols-2 gap-4">
                                             <Input label="Expiration (MM/YY)" placeholder="MM / YY" />
                                             <Input label="Security Code" placeholder="CVC" />
                                        </div>
                                        <Input label="Name on Card" placeholder="Jane Doe" />
                                   </div>
                              </div>
                         </section>

                         <div>
                              <button
                                   type="submit"
                                   className="w-full bg-stone-900 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-all duration-300 transform active:scale-[0.99] mb-4"
                              >
                                   Pay ${finalTotal.toFixed(2)}
                              </button>
                              <button
                                   onClick={() => navigate("/#shop")}
                                   className="w-full bg-white text-stone-900 border border-stone-200 py-4 uppercase rounded-full font-medium text-xs hover:bg-stone-50 transition-colors tracking-widest transition-colors mb-4"
                              >
                                   Continue Shopping
                              </button>
                         </div>

                    </form>

                    <footer className="max-w-xl mx-auto mt-16 pt-8 border-t border-stone-100 flex gap-6 text-xs text-stone-400">
                         <a href="#" className="hover:text-stone-800 transition-colors">
                              Refund Policy
                         </a>
                         <a href="#" className="hover:text-stone-800 transition-colors">
                              Shipping Policy
                         </a>
                         <a href="#" className="hover:text-stone-800 transition-colors">
                              Privacy Policy
                         </a>
                    </footer>
               </div>

               {/* RIGHT COLUMN: Order Summary */}
               <div className="hidden lg:block w-[480px] bg-stone-50 border-l border-stone-200 relative">
                    <div className="sticky top-0 h-screen overflow-y-auto p-12">
                         <h2 className="font-serif text-2xl text-stone-900 mb-8">Order Summary</h2>

                         <div className="space-y-6 mb-8">
                              {items.map(item => (
                                   <div key={item.id} className="flex gap-4 items-center">
                                        {/* FIX APPLIED HERE:
                                    Added a wrapper div 'relative' to hold the badge.
                                    The badge is now a sibling to the image container,
                                    so it sits ON TOP without getting clipped by overflow-hidden.
                                */}
                                        <div className="relative flex-shrink-0">
                                             <div className="w-16 h-20 bg-white rounded-md border border-stone-200 overflow-hidden">
                                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                             </div>
                                             <span className="absolute -top-2 -right-2 w-5 h-5 bg-stone-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm z-10">
                                                  {item.quantity}
                                             </span>
                                        </div>

                                        <div className="flex-grow">
                                             <h4 className="font-serif text-stone-900 text-sm">{item.name}</h4>
                                             <p className="text-xs text-stone-500">{item.scentNotes[0]}</p>
                                        </div>
                                        <span className="text-sm font-medium text-stone-900">${(item.price * item.quantity).toFixed(2)}</span>
                                   </div>
                              ))}
                         </div>

                         <div className="border-t border-stone-200 my-8"></div>

                         <div className="flex gap-3 mb-8">
                              <input
                                   type="text"
                                   placeholder="Gift card or discount code"
                                   className="flex-grow px-4 py-3 bg-white border border-stone-200 rounded-md text-sm outline-none focus:border-stone-900 transition-colors"
                              />
                              <button className="px-6 py-3 bg-stone-200 text-stone-600 rounded-md text-sm font-bold uppercase tracking-wider hover:bg-stone-300 transition-colors">
                                   Apply
                              </button>
                         </div>

                         <div className="border-t border-stone-200 my-8"></div>

                         <div className="space-y-3 text-sm">
                              <div className="flex justify-between text-stone-600">
                                   <span>Subtotal</span>
                                   <span>${total.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-stone-600">
                                   <span>Shipping</span>
                                   <span>${shipping.toFixed(2)}</span>
                              </div>
                         </div>

                         <div className="border-t border-stone-200 my-8"></div>

                         <div className="flex justify-between items-end">
                              <span className="font-serif text-xl text-stone-900">Total</span>
                              <div className="text-right">
                                   <span className="text-xs text-stone-500 mr-2">USD</span>
                                   <span className="font-serif text-2xl text-stone-900">${finalTotal.toFixed(2)}</span>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}

const Input: React.FC<InputProps> = ({ label, icon, className, ...props }) => (
     <div className={`space-y-1 ${className}`}>
          <label className="text-xs uppercase tracking-wider font-bold text-stone-500">{label}</label>
          <div className="relative">
               <input
                    className="w-full px-4 py-3 bg-transparent border border-stone-200 rounded-md text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                    {...props}
               />
               {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">{icon}</div>}
          </div>
     </div>
)

// Reusable Input Helper
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label: string
     icon?: React.ReactNode
}

export default CheckoutPage
