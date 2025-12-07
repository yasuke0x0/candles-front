import { useFormikContext } from "formik"
import type { CheckoutValues } from "../CheckoutPage.tsx"
import Input from "@components/form/Input.tsx"
import { Check } from "lucide-react"

const StepContact = () => {
     const { values, handleChange, handleBlur, errors, touched } = useFormikContext<CheckoutValues>()

     return (
          <div className="animate-fade-in">
               <h2 className="font-serif text-3xl text-stone-900 mb-2">Contact Information</h2>
               <p className="text-stone-500 text-sm mb-8">Where should we send your order confirmation?</p>

               <div className="space-y-6">
                    <Input
                         label="Email Address"
                         name="email"
                         type="email"
                         placeholder="you@example.com"
                         value={values.email}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={errors.email}
                         touched={touched.email}
                    />

                    <label className="flex items-start gap-4 p-5 border border-stone-200 rounded-xl cursor-pointer hover:border-stone-400 transition-all group bg-stone-50/30 hover:bg-stone-50">
                         <div className="relative flex items-center mt-0.5">
                              <input
                                   type="checkbox"
                                   name="newsletter"
                                   checked={values.newsletter}
                                   onChange={handleChange}
                                   className="peer sr-only" // Hide the default browser checkbox
                              />
                              {/* Custom Checkbox UI */}
                              <div
                                   className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ease-out ${
                                        values.newsletter
                                             ? "bg-stone-900 border-stone-900 shadow-md shadow-stone-900/20"
                                             : "bg-white border-stone-300 group-hover:border-stone-400"
                                   }`}
                              >
                                   <Check
                                        size={12}
                                        className={`text-white transition-transform duration-200 ease-back-out ${
                                             values.newsletter ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                        }`}
                                        strokeWidth={3}
                                   />
                              </div>
                         </div>
                         <div className="text-sm">
                              <span className="block font-bold text-stone-900 group-hover:text-stone-800 mb-0.5 transition-colors">
                                   Join the Atelier Club
                              </span>
                              <span className="text-xs text-stone-500 leading-relaxed block">
                                   Receive exclusive offers, early access to new scents, and{" "}
                                   <span className="font-bold text-stone-900">10% off your next order</span>.
                              </span>
                         </div>
                    </label>
               </div>
          </div>
     )
}

export default StepContact
