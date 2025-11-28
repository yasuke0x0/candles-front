import { useContext, useEffect, useState } from "react"
import { Form, Formik, type FormikHelpers, useFormikContext } from "formik"
import * as Yup from "yup"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ChevronLeft, HelpCircle, Loader2, ShieldCheck } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import { AppContext } from "../../app/App.tsx"
import { CHECKOUT_FORM_STORAGE_KEY, STRIPE_PUBLIC_KEY } from "@constants"
import OrderSummary from "./components/OrderSummary"
import StepContact from "./components/StepContact"
import StepShipping from "./components/StepShipping"
import StepBilling from "./components/StepBilling"
import StepPayment from "./components/StepPayment"
import { PAYMENT_INTENT_ENDPOINT } from "@endpoints"

// --- STRIPE CONFIG ---
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

// --- FORM PERSISTER COMPONENT ---
// This invisible component watches for form changes and saves them to localStorage
const FormPersister = () => {
     const { values } = useFormikContext<CheckoutValues>()

     useEffect(() => {
          const timeoutId = setTimeout(() => {
               localStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(values))
          }, 500) // Debounce saves to avoid hitting storage on every keystroke

          return () => clearTimeout(timeoutId)
     }, [values])

     return null
}

// Define the shape of our form data
export interface CheckoutValues {
     email: string
     newsletter: boolean
     shipping: {
          type: "personal" | "company"
          firstName: string
          lastName: string
          companyName: string
          address: string
          city: string
          zip: string
          country: string
     }
     billing: {
          sameAsShipping: boolean
          firstName: string
          lastName: string
          address: string
          city: string
          zip: string
          country: string
     }
}

const defaultValues: CheckoutValues = {
     email: "",
     newsletter: false,
     shipping: {
          type: "personal",
          firstName: "",
          lastName: "",
          companyName: "",
          address: "",
          city: "",
          zip: "",
          country: "",
     },
     billing: {
          sameAsShipping: true,
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          zip: "",
          country: "",
     },
}

const steps = ["Contact", "Shipping", "Billing", "Payment"]

// --- Validation Schemas ---
const validationSchemas = [
     // Step 0: Contact
     Yup.object({
          email: Yup.string().email("Invalid email address").required("Email is required"),
     }),
     // Step 1: Shipping
     Yup.object({
          shipping: Yup.object({
               type: Yup.string().oneOf(["personal", "company"]),
               firstName: Yup.string().required("First name is required"),
               lastName: Yup.string().required("Last name is required"),
               companyName: Yup.string().when("type", {
                    is: "company",
                    then: schema => schema.required("Company name is required"),
               }),
               address: Yup.string().required("Address is required"),
               city: Yup.string().required("City is required"),
               zip: Yup.string().required("ZIP code is required"),
               country: Yup.string().required("Country is required"),
          }),
     }),
     // Step 2: Billing
     Yup.object({
          billing: Yup.object({
               sameAsShipping: Yup.boolean(),
               firstName: Yup.string().when("sameAsShipping", {
                    is: false,
                    then: schema => schema.required("First name is required"),
               }),
               lastName: Yup.string().when("sameAsShipping", {
                    is: false,
                    then: schema => schema.required("Last name is required"),
               }),
               address: Yup.string().when("sameAsShipping", {
                    is: false,
                    then: schema => schema.required("Address is required"),
               }),
               city: Yup.string().when("sameAsShipping", {
                    is: false,
                    then: schema => schema.required("City is required"),
               }),
               zip: Yup.string().when("sameAsShipping", {
                    is: false,
                    then: schema => schema.required("ZIP code is required"),
               }),
               country: Yup.string().when("sameAsShipping", {
                    is: false,
                    then: schema => schema.required("Country is required"),
               }),
          }),
     }),
     // Step 3: Payment
     Yup.object({}),
]

const CheckoutPage = () => {
     const [searchParams] = useSearchParams()
     const navigate = useNavigate()
     const { cartItems } = useContext(AppContext)

     // Initialize step from URL query param if present (e.g. ?step=3)
     const [currentStep, setCurrentStep] = useState(searchParams.get("step") ? Number(searchParams.get("step")) : 0)
     const [clientSecret, setClientSecret] = useState<string | null>(null)

     // Initialize Form Values from LocalStorage or Default
     const [initialValues] = useState<CheckoutValues>(() => {
          try {
               const saved = localStorage.getItem(CHECKOUT_FORM_STORAGE_KEY)
               return saved ? JSON.parse(saved) : defaultValues
          } catch (error) {
               console.error("Failed to load saved form data", error)
               return defaultValues
          }
     })

     // --- FETCH CLIENT SECRET ---
     useEffect(() => {
          if (currentStep === 3 && !clientSecret) {
               fetch(PAYMENT_INTENT_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: cartItems }),
               })
                    .then(res => {
                         if (!res.ok) throw new Error("Failed to initialize payment")
                         return res.json()
                    })
                    .then(data => {
                         setClientSecret(data.clientSecret)
                    })
                    .catch(err => {
                         console.error("Payment Init Error:", err)
                         alert("Could not initialize payment system. Please try again.")
                    })
          }
     }, [currentStep, clientSecret, cartItems])

     const handleBack = () => {
          if (currentStep > 0) {
               setCurrentStep(prev => prev - 1)
          }
     }

     const handleReturnToCart = () => navigate("/cart")

     const handleFormSubmit = (_: any, actions: FormikHelpers<CheckoutValues>) => {
          // If we are NOT on the payment step, validate and move next.
          // If we ARE on the payment step (index 3), we do nothing here;
          // StepPayment handles the submission via Stripe.
          if (currentStep !== steps.length - 1) {
               actions.setTouched({})
               actions.setSubmitting(false)
               setCurrentStep(prev => prev + 1)
               window.scrollTo(0, 0)
          }
     }

     return (
          <div className="min-h-screen bg-white lg:flex font-sans text-stone-900">
               {/* LEFT COLUMN: Form Wizard */}
               <div className="flex-1 flex flex-col h-screen overflow-y-auto relative scrollbar-hide">
                    <div className="flex-grow px-6 py-12 md:px-12 lg:px-24">
                         <div className="max-w-xl mx-auto">
                              {/* Top Navigation Header */}
                              <div className="flex justify-between items-center mb-12">
                                   <button
                                        onClick={currentStep === 0 ? handleReturnToCart : handleBack}
                                        className="flex items-center text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 transition-colors group"
                                   >
                                        <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                        {currentStep === 0 ? "Return to Cart" : "Back"}
                                   </button>
                                   <div className="flex items-center gap-2 text-stone-300 text-[10px] uppercase tracking-widest">
                                        <ShieldCheck size={14} />
                                        <span>Secure</span>
                                   </div>
                              </div>

                              {/* Step Progress Indicator */}
                              <div className="mb-12">
                                   <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-stone-300 mb-4">
                                        {steps.map((step, index) => (
                                             <span key={step} className={`transition-colors duration-300 ${index <= currentStep ? "text-stone-900" : ""}`}>
                                                  {step}
                                             </span>
                                        ))}
                                   </div>
                                   <div className="h-1 bg-stone-100 w-full rounded-full overflow-hidden">
                                        <div
                                             className="h-full bg-stone-900 transition-all duration-500 ease-out"
                                             style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        ></div>
                                   </div>
                              </div>

                              {/* The Form */}
                              <Formik initialValues={initialValues} validationSchema={validationSchemas[currentStep]} onSubmit={handleFormSubmit} enableReinitialize>
                                   {formik => (
                                        <Form>
                                             {/* Auto-save form values */}
                                             <FormPersister />

                                             <div className="min-h-[400px]">
                                                  {currentStep === 0 && <StepContact />}
                                                  {currentStep === 1 && <StepShipping />}
                                                  {currentStep === 2 && <StepBilling />}

                                                  {/* PAYMENT STEP WRAPPER */}
                                                  {currentStep === 3 &&
                                                       (clientSecret ? (
                                                            <Elements
                                                                 stripe={stripePromise}
                                                                 options={{
                                                                      clientSecret,
                                                                      appearance: {
                                                                           theme: "stripe",
                                                                           variables: {
                                                                                colorPrimary: "#1c1917",
                                                                                fontFamily: '"Lato", sans-serif',
                                                                           },
                                                                      },
                                                                 }}
                                                            >
                                                                 <StepPayment clientSecret={clientSecret} />
                                                            </Elements>
                                                       ) : (
                                                            <div className="h-60 flex items-center justify-center text-stone-400 text-sm animate-pulse">
                                                                 Preparing secure payment...
                                                            </div>
                                                       ))}
                                             </div>

                                             {/* Footer Actions */}
                                             <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-6">
                                                  {/* Left Side: Back button */}
                                                  <button
                                                       type="button"
                                                       onClick={currentStep === 0 ? handleReturnToCart : handleBack}
                                                       className="group flex items-center justify-center md:justify-start text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors py-3 w-full md:w-auto"
                                                  >
                                                       <ChevronLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
                                                       <span className="leading-none mt-0.5">{currentStep === 0 ? "Return to Cart" : "Back"}</span>
                                                  </button>

                                                  {/* Right Side: Submit Button */}
                                                  <button
                                                       type="submit"
                                                       disabled={formik.isSubmitting || (currentStep === 3 && !clientSecret)}
                                                       className="bg-stone-900 text-white w-full md:w-auto px-10 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-stone-800 transition-all shadow-lg hover:shadow-stone-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                  >
                                                       {/* Added Loader2 for visual feedback during processing */}
                                                       {formik.isSubmitting ? (
                                                            <>
                                                                 <Loader2 className="w-4 h-4 animate-spin" />
                                                                 <span>Processing...</span>
                                                            </>
                                                       ) : currentStep === steps.length - 1 ? (
                                                            "Pay & Complete Order"
                                                       ) : (
                                                            `Continue to ${steps[currentStep + 1]}`
                                                       )}
                                                  </button>
                                             </div>
                                        </Form>
                                   )}
                              </Formik>
                         </div>
                    </div>

                    {/* Footer */}
                    <div className="py-8 border-t border-stone-100 bg-stone-50/50">
                         <div className="max-w-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-4">
                              <button className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 transition-colors group">
                                   <HelpCircle size={14} className="group-hover:text-stone-900" />
                                   <span className="underline underline-offset-4">Need help with your order?</span>
                              </button>
                              <div className="text-[10px] text-stone-300 uppercase tracking-widest">© 2025 Lumina Botanicals</div>
                         </div>
                    </div>
               </div>

               {/* RIGHT COLUMN: Order Summary */}
               <OrderSummary />
          </div>
     )
}

export default CheckoutPage
