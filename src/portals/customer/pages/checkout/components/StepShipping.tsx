import { useFormikContext } from "formik"
import { Building2, User } from "lucide-react"

import Input from "@components/form/Input.tsx"
import type { CheckoutValues } from "../CheckoutPage.tsx"
import Select from "./Select.tsx"

const StepShipping = () => {
     const { values, setFieldValue, handleChange, handleBlur, errors, touched } = useFormikContext<CheckoutValues>()

     return (
          <div className="animate-fade-in">
               <h2 className="font-serif text-3xl text-stone-900 mb-2">Shipping Details</h2>
               <p className="text-stone-500 text-sm mb-8">Where would you like your scents delivered?</p>

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
                         label="Phone Number"
                         name="shipping.phone"
                         placeholder="06 12 34 56 78"
                         value={values.shipping.phone}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={errors.shipping?.phone}
                         touched={touched.shipping?.phone}
                    />

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
