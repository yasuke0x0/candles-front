import { useContext, useEffect, useMemo, useState } from "react"
import { Form, Formik, type FormikHelpers, useFormikContext } from "formik"
import * as Yup from "yup"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ChevronDown, ChevronLeft, ChevronUp, Loader2, ShieldCheck, ShoppingBag } from "lucide-react"
import axios from "axios"

import { CHECKOUT_FORM_STORAGE_KEY } from "@portals/customer/constants.ts"

import OrderSummary from "./components/OrderSummary.tsx"
import StepContact from "./components/StepContact.tsx"
import StepShipping from "./components/StepShipping.tsx"
import StepBilling from "./components/StepBilling.tsx"
import StepPayment from "./components/StepPayment.tsx"
import { CustomerPortalContext } from "@portals/customer/CustomerPortal.tsx"
import { USERS_SAVE_CONTACT_ENDPOINT } from "@api-endpoints"

// --- FORM PERSISTER ---
const FormPersister = () => {
     const { values } = useFormikContext<CheckoutValues>()
     useEffect(() => {
          const timeoutId = setTimeout(() => {
               localStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(values))
          }, 500)
          return () => clearTimeout(timeoutId)
     }, [values])
     return null
}

// --- MOBILE HEADER ---
const MobileSummaryToggle = ({ isOpen, onToggle, shippingCost }: { isOpen: boolean; onToggle: () => void; shippingCost: number | null }) => {
     const { cartItems: items, coupon } = useContext(CustomerPortalContext)

     // Recalculate basic total for the header preview
     const total = useMemo(() => {
          const subtotal = items.reduce((acc, item) => acc + item.currentPrice * item.quantity, 0)
          let couponDiscount = 0

          if (coupon) {
               if (coupon.type === "PERCENTAGE") {
                    couponDiscount = subtotal * (coupon.value / 100)
               } else {
                    couponDiscount = coupon.value
               }
               couponDiscount = Math.min(couponDiscount, subtotal)
          }

          // Use 0 if shipping is not yet calculated
          const safeShipping = shippingCost ?? 0
          return Math.max(0, subtotal - couponDiscount + safeShipping).toFixed(2)
     }, [items, coupon, shippingCost])

     return (
          <div className="lg:hidden border-b border-stone-200 bg-stone-50">
               <button onClick={onToggle} type="button" className="w-full px-6 py-4 flex items-center justify-between text-stone-900 hover:bg-stone-100 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-600">
                         <ShoppingBag size={16} />
                         <span className="mt-0.5">{isOpen ? "Hide" : "Show"} Order Summary</span>
                         {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                    <span className="font-serif text-lg leading-none">${total}</span>
               </button>
               {isOpen && <OrderSummary isMobile={true} shippingCost={shippingCost} />}
          </div>
     )
}

// ... [Keep CheckoutValues interface and defaultValues] ...
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
          companyName: "",
          address: "",
          city: "",
          zip: "",
          lastName: "",
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
     const [currentStep, setCurrentStep] = useState(searchParams.get("step") ? Number(searchParams.get("step")) : 0)
     const [paymentReady, setPaymentReady] = useState(false)
     const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)

     // --- FIXED: Initialize as NULL so "Enter address" message shows ---
     const [shippingCost, setShippingCost] = useState<number | null>(null)
     const [isShippingLoading, setIsShippingLoading] = useState(false)

     const [initialValues] = useState<CheckoutValues>(() => {
          try {
               const saved = localStorage.getItem(CHECKOUT_FORM_STORAGE_KEY)
               return saved ? JSON.parse(saved) : defaultValues
          } catch (error) {
               console.error("Failed to load saved form data", error)
               return defaultValues
          }
     })

     useEffect(() => {
          if (currentStep !== 3) {
               setPaymentReady(false)
          }
     }, [currentStep])

     const handleBack = () => {
          if (currentStep > 0) setCurrentStep(prev => prev - 1)
     }

     const handleReturnToCart = () => navigate("/cart")

     const handleFormSubmit = async (values: CheckoutValues, actions: FormikHelpers<CheckoutValues>) => {
          if (currentStep === 0) {
               try {
                    await axios.post(USERS_SAVE_CONTACT_ENDPOINT, {
                         email: values.email,
                         newsletter: values.newsletter,
                    })
               } catch (error) {
                    console.warn("Failed to save contact info:", error)
               }
          }

          if (currentStep !== steps.length - 1) {
               await actions.setTouched({})
               actions.setSubmitting(false)
               setPaymentReady(false)
               setCurrentStep(prev => prev + 1)
               window.scrollTo(0, 0)
               return
          }
          return new Promise(() => {})
     }

     return (
          <div className="min-h-screen bg-white lg:flex font-sans text-stone-900">
               {/* LEFT COLUMN: Form Wizard */}
               <div className="flex-1 flex flex-col h-screen overflow-y-auto relative scrollbar-hide">

                    {/* --- MOBILE ORDER SUMMARY TOGGLE --- */}
                    <MobileSummaryToggle
                         isOpen={isMobileSummaryOpen}
                         onToggle={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
                         shippingCost={shippingCost} // Pass nullable state
                    />

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
                                             <FormPersister />

                                             <div className="min-h-[400px]">
                                                  {currentStep === 0 && <StepContact />}
                                                  {currentStep === 1 && <StepShipping setShippingCost={setShippingCost} setIsLoading={setIsShippingLoading} />}
                                                  {currentStep === 2 && <StepBilling />}
                                                  {currentStep === 3 && <StepPayment onReady={setPaymentReady} />}
                                             </div>

                                             <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-6">
                                                  <button
                                                       type="button"
                                                       onClick={currentStep === 0 ? handleReturnToCart : handleBack}
                                                       className="group flex items-center justify-center md:justify-start text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors py-3 w-full md:w-auto"
                                                  >
                                                       <ChevronLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
                                                       <span className="leading-none mt-0.5">{currentStep === 0 ? "Return to Cart" : "Back"}</span>
                                                  </button>

                                                  <button
                                                       type="submit"
                                                       disabled={formik.isSubmitting || (currentStep === 3 && !paymentReady)}
                                                       className="bg-stone-900 text-white w-full md:w-auto px-10 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-stone-800 transition-all shadow-lg hover:shadow-stone-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                  >
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
                    {/* ... [Footer remains same] ... */}
               </div>

               {/* Pass shipping state to Desktop Summary */}
               <OrderSummary shippingCost={shippingCost} isLoading={isShippingLoading} />
          </div>
     )
}

export default CheckoutPage
