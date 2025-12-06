import { useContext, useEffect } from "react"
import { useFormikContext } from "formik"
import { Building2, User } from "lucide-react"
import axios from "axios"

import Input from "./Input.tsx"
import type { CheckoutValues } from "../CheckoutPage.tsx"
import Select from "./Select.tsx"
import { SHIPPING_RATES_ENDPOINT } from "@api-endpoints"
import { CustomerPortalContext } from "@portals/customer/CustomerPortal.tsx"

interface StepShippingProps {
     setShippingCost: (cost: number | null) => void // Allow null here
     setIsLoading: (loading: boolean) => void
}

const StepShipping = ({ setShippingCost, setIsLoading }: StepShippingProps) => {
     const { values, setFieldValue, handleChange, handleBlur, errors, touched } = useFormikContext<CheckoutValues>()
     const { cartItems } = useContext(CustomerPortalContext)

     // Auto-calculate shipping when address changes
     useEffect(() => {
          const { city, zip, country, address } = values.shipping

          // Only fetch if we have enough info to generate a rate
          if (city && zip && country && address) {
               const fetchRates = async () => {
                    setIsLoading(true)
                    try {
                         const response = await axios.post(SHIPPING_RATES_ENDPOINT, {
                              address: values.shipping,
                              items: cartItems,
                         })

                         // Update parent state with the cost from backend (Shippo)
                         if (typeof response.data.cost === "number") {
                              setShippingCost(response.data.cost)
                         }
                    } catch (error) {
                         console.error("Failed to fetch shipping rates", error)
                         // Fallback to standard rate if API fails (e.g. 7.90)
                         setShippingCost(7.9)
                    } finally {
                         setIsLoading(false)
                    }
               }

               // Debounce slightly (800ms) to avoid spamming API while typing
               const timer = setTimeout(fetchRates, 800)
               return () => clearTimeout(timer)
          } else {
               // --- NEW: Reset to null if address incomplete ---
               setShippingCost(null)
          }
     }, [values.shipping.city, values.shipping.zip, values.shipping.country, values.shipping.address, cartItems, setShippingCost, setIsLoading])

     return (
          <div className="animate-fade-in">
               <h2 className="font-serif text-3xl text-stone-900 mb-2">Shipping Details</h2>
               <p className="text-stone-500 text-sm mb-8">Where would you like your scents delivered?</p>

               {/* Customer Type Selector */}
               <div className="flex gap-4 mb-8">
                    <button
                         type="button"
                         onClick={() => setFieldValue("shipping.type", "personal")}
                         className={`flex-1 py-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                              values.shipping.type === "personal"
                                   ? "border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900"
                                   : "border-stone-200 text-stone-400 hover:border-stone-400"
                         }`}
                    >
                         <User size={20} />
                         <span className="text-xs font-bold uppercase tracking-widest">Personal</span>
                    </button>
                    <button
                         type="button"
                         onClick={() => setFieldValue("shipping.type", "company")}
                         className={`flex-1 py-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                              values.shipping.type === "company"
                                   ? "border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900"
                                   : "border-stone-200 text-stone-400 hover:border-stone-400"
                         }`}
                    >
                         <Building2 size={20} />
                         <span className="text-xs font-bold uppercase tracking-widest">Company</span>
                    </button>
               </div>

               <div className="space-y-4">
                    {values.shipping.type === "company" && (
                         <Input
                              label="Company Name"
                              name="shipping.companyName"
                              placeholder="Acme Corp"
                              value={values.shipping.companyName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.shipping?.companyName}
                              touched={touched.shipping?.companyName}
                         />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                         <Input
                              label="First Name"
                              name="shipping.firstName"
                              placeholder="Jane"
                              value={values.shipping.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.shipping?.firstName}
                              touched={touched.shipping?.firstName}
                         />
                         <Input
                              label="Last Name"
                              name="shipping.lastName"
                              placeholder="Doe"
                              value={values.shipping.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.shipping?.lastName}
                              touched={touched.shipping?.lastName}
                         />
                    </div>

                    <Input
                         label="Street Address"
                         name="shipping.address"
                         placeholder="123 Artisan Avenue"
                         value={values.shipping.address}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={errors.shipping?.address}
                         touched={touched.shipping?.address}
                    />

                    <Input
                         label="City"
                         name="shipping.city"
                         placeholder="New York"
                         value={values.shipping.city}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={errors.shipping?.city}
                         touched={touched.shipping?.city}
                    />

                    <div className="grid grid-cols-2 gap-4">
                         <Input
                              label="ZIP Code"
                              name="shipping.zip"
                              placeholder="10001"
                              value={values.shipping.zip}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.shipping?.zip}
                              touched={touched.shipping?.zip}
                         />
                         <Select
                              label="Country"
                              name="shipping.country"
                              value={values.shipping.country}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.shipping?.country}
                              touched={touched.shipping?.country}
                         >
                              <option value="" disabled hidden>
                                   Select Country
                              </option>
                              <option value="Switzerland">Switzerland</option>
                              <option value="United States">United States</option>
                              <option value="France">France</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                         </Select>
                    </div>
               </div>
          </div>
     )
}

export default StepShipping
