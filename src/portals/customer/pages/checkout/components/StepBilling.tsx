import { useFormikContext } from "formik"
import { AnimatePresence, motion } from "framer-motion"
import Input from "./Input.tsx"
import type { CheckoutValues } from "../CheckoutPage.tsx"
import Select from "./Select.tsx"

const StepBilling = () => {
     const { values, handleChange, setFieldValue, errors, touched, handleBlur } = useFormikContext<CheckoutValues>()

     return (
          <div className="animate-fade-in">
               <h2 className="font-serif text-3xl text-stone-900 mb-2">Billing Address</h2>
               <p className="text-stone-500 text-sm mb-8">Select the address that matches your card or payment method.</p>

               <div className="space-y-4">
                    {/* Same as shipping toggle */}
                    <label
                         className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition-all ${
                              values.billing.sameAsShipping ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900" : "border-stone-200 hover:border-stone-400"
                         }`}
                    >
                         <div className="relative flex items-center">
                              <input
                                   type="radio"
                                   name="billing.sameAsShipping"
                                   checked={values.billing.sameAsShipping}
                                   onChange={() => setFieldValue("billing.sameAsShipping", true)}
                                   className="w-5 h-5 border-stone-300 text-stone-900 focus:ring-stone-900"
                              />
                         </div>
                         <div>
                              <span className="block font-bold text-stone-900 text-sm">Same as shipping address</span>
                              <span className="text-xs text-stone-500">{values.shipping.address || "No address entered yet"}</span>
                         </div>
                    </label>

                    <label
                         className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition-all ${
                              !values.billing.sameAsShipping ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900" : "border-stone-200 hover:border-stone-400"
                         }`}
                    >
                         <input
                              type="radio"
                              name="billing.sameAsShipping"
                              checked={!values.billing.sameAsShipping}
                              onChange={() => setFieldValue("billing.sameAsShipping", false)}
                              className="w-5 h-5 border-stone-300 text-stone-900 focus:ring-stone-900"
                         />
                         <span className="font-bold text-stone-900 text-sm">Use a different billing address</span>
                    </label>

                    {/* Expanded Form for Different Address */}
                    <AnimatePresence>
                         {!values.billing.sameAsShipping && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden p-1">
                                   <div className="pt-4 space-y-4 border-t border-stone-100 mt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                             <Input
                                                  label="First Name"
                                                  name="billing.firstName"
                                                  placeholder="Jane"
                                                  value={values.billing.firstName}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  error={errors.billing?.firstName}
                                                  touched={touched.billing?.firstName}
                                             />
                                             <Input
                                                  label="Last Name"
                                                  name="billing.lastName"
                                                  placeholder="Doe"
                                                  value={values.billing.lastName}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  error={errors.billing?.lastName}
                                                  touched={touched.billing?.lastName}
                                             />
                                        </div>
                                        <Input
                                             label="Address"
                                             name="billing.address"
                                             placeholder="123 Artisan Avenue"
                                             value={values.billing.address}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors.billing?.address}
                                             touched={touched.billing?.address}
                                        />
                                        <Input
                                             label="City"
                                             name="billing.city"
                                             placeholder="New York"
                                             value={values.billing.city}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors.billing?.city}
                                             touched={touched.billing?.city}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                             <Input
                                                  label="ZIP Code"
                                                  name="billing.zip"
                                                  placeholder="10001"
                                                  value={values.billing.zip}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  error={errors.billing?.zip}
                                                  touched={touched.billing?.zip}
                                             />
                                             <Select
                                                  label="Country"
                                                  name="billing.country"
                                                  value={values.billing.country}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  error={errors.billing?.country}
                                                  touched={touched.billing?.country}
                                             >
                                                  <option value="" disabled hidden>
                                                       Select Country
                                                  </option>
                                                  <option value="United States">United States</option>
                                                  <option value="France">France</option>
                                                  <option value="Canada">Canada</option>
                                                  <option value="United Kingdom">United Kingdom</option>
                                             </Select>
                                        </div>
                                   </div>
                              </motion.div>
                         )}
                    </AnimatePresence>
               </div>
          </div>
     )
}

export default StepBilling
