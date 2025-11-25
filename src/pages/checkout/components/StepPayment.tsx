import { useFormikContext } from "formik"
import { CreditCard, Lock } from "lucide-react"
import type { CheckoutValues } from "../CheckoutPage"
import Input from "@pages/checkout/components/Input.tsx"

const StepPayment = () => {
     const { values, handleChange } = useFormikContext<CheckoutValues>()

     return (
          <div className="animate-fade-in">
               <h2 className="font-serif text-3xl text-stone-900 mb-2">Payment</h2>
               <p className="text-stone-500 text-sm mb-8">All transactions are secure and encrypted.</p>

               <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-900">
                                   <CreditCard size={20} />
                              </div>
                              <span className="font-bold text-stone-900 text-sm uppercase tracking-wider">Credit Card</span>
                         </div>
                         <div className="flex gap-2 opacity-50 grayscale">
                              {/* You can replace these with actual SVG logos */}
                              <div className="w-8 h-5 bg-stone-300 rounded"></div>
                              <div className="w-8 h-5 bg-stone-300 rounded"></div>
                         </div>
                    </div>

                    <div className="space-y-5">
                         <Input
                              label="Card Number"
                              name="payment.cardNumber"
                              placeholder="0000 0000 0000 0000"
                              icon={<Lock size={14} />}
                              value={values.payment.cardNumber}
                              onChange={handleChange}
                              maxLength={19}
                         />

                         <div className="grid grid-cols-2 gap-5">
                              <Input label="Expiry Date" name="payment.exp" placeholder="MM / YY" value={values.payment.exp} onChange={handleChange} maxLength={5} />
                              <Input label="Security Code" name="payment.cvc" placeholder="CVC" type="password" value={values.payment.cvc} onChange={handleChange} maxLength={4} />
                         </div>

                         <Input label="Name on Card" name="payment.nameOnCard" placeholder="JANE DOE" value={values.payment.nameOnCard} onChange={handleChange} />
                    </div>
               </div>
          </div>
     )
}

export default StepPayment
