import { useFormikContext } from "formik"
import type { CheckoutValues } from "@pages/checkout/CheckoutPage.tsx"
import Input from "./Input"

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
                         onBlur={handleBlur} // Important for 'touched' state
                         error={errors.email}
                         touched={touched.email}
                    />

                    <label className="flex items-start gap-3 p-4 border border-stone-200 rounded-lg cursor-pointer hover:border-stone-400 transition-colors group">
                         <input
                              type="checkbox"
                              name="newsletter"
                              checked={values.newsletter}
                              onChange={handleChange}
                              className="mt-1 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                         />
                         <div className="text-sm">
                              <span className="block font-bold text-stone-900 group-hover:text-stone-700">Join our newsletter</span>
                              <span className="text-stone-500">Receive exclusive offers and 10% off your next order.</span>
                         </div>
                    </label>
               </div>
          </div>
     )
}

export default StepContact
