import { useContext, useEffect, useMemo, useState } from "react"
import { Form, Formik, type FormikHelpers, useFormikContext } from "formik"
import * as Yup from "yup"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AlertCircle, ChevronDown, ChevronLeft, ChevronUp, Loader2, ShieldCheck, ShoppingBag } from "lucide-react"
import axios from "axios"

import { CHECKOUT_FORM_STORAGE_KEY } from "@portals/customer/constants.ts"

import OrderSummary from "./components/OrderSummary.tsx"
import StepContact from "./components/StepContact.tsx"
import StepShipping from "./components/StepShipping.tsx"
import StepBilling from "./components/StepBilling.tsx"
import StepPayment from "./components/StepPayment.tsx"
import { CustomerPortalContext } from "@portals/customer/CustomerPortal.tsx"
import { SHIPPING_RATES_ENDPOINT, USERS_SAVE_CONTACT_ENDPOINT } from "@api-endpoints"

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

     const total = useMemo(() => {
          const subtotal = items.reduce((acc, item) => acc + item.currentPrice! * item.quantity, 0)
          let couponDiscount = 0

          if (coupon) {
               if (coupon.type === "PERCENTAGE") {
                    couponDiscount = subtotal * (coupon.value / 100)
               } else {
                    couponDiscount = coupon.value
               }
               couponDiscount = Math.min(couponDiscount, subtotal)
          }

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

// --- CHECKOUT VALUES INTERFACE ---
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
          phone: string
     }
     billing: {
          sameAsShipping: boolean
          firstName: string
          lastName: string
          address: string
          city: string
          zip: string
          country: string
          phone: string
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
          phone: "",
     },
     billing: {
          sameAsShipping: true,
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          zip: "",
          country: "",
          phone: "",
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
               phone: Yup.string().required("Phone number is required"),
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
               phone: Yup.string().when("sameAsShipping", {
                    is: false,
                    then: schema => schema.required("Phone number is required"),
               }),
          }),
     }),
     // Step 3: Payment
     Yup.object({}),
]

const CheckoutPage = () => {
     const { cartItems } = useContext(CustomerPortalContext)
     const [searchParams] = useSearchParams()
     const navigate = useNavigate()
     const [currentStep, setCurrentStep] = useState(searchParams.get("step") ? Number(searchParams.get("step")) : 0)
     const [paymentReady, setPaymentReady] = useState(false)
     const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)

     // Shipping State
     const [shippingCost, setShippingCost] = useState<number | null>(null)
     const [isShippingLoading, setIsShippingLoading] = useState(false)
     const [shippingError, setShippingError] = useState<string | null>(null)

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
          // --- STEP 0: CONTACT ---
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

          // --- STEP 1: SHIPPING CALCULATION ---
          if (currentStep === 1) {
               setIsShippingLoading(true)
               setShippingError(null)

               const fetchRates = async () => {
                    const response = await axios.post(SHIPPING_RATES_ENDPOINT, {
                         address: values.shipping,
                         items: cartItems,
                    })
                    if (typeof response.data.cost !== "number") throw new Error("Invalid rate")
                    return response.data.cost
               }

               try {
                    let cost
                    try {
                         // Attempt 1
                         cost = await fetchRates()
                    } catch (err) {
                         console.warn("First shipping calculation attempt failed, retrying...", err)
                         // Attempt 2 (Retry)
                         await new Promise(r => setTimeout(r, 5000)) // Slight delay
                         cost = await fetchRates()
                    }

                    // Success
                    setShippingCost(cost)
                    await actions.setTouched({})
                    actions.setSubmitting(false)
                    setIsShippingLoading(false)
                    setCurrentStep(prev => prev + 1)
                    window.scrollTo(0, 0)
                    return // Done with this step
               } catch (error) {
                    console.error("Shipping calculation failed:", error)
                    setShippingError("Unable to calculate shipping rates for this address. Please verify your details and try again.")
                    setIsShippingLoading(false)
                    actions.setSubmitting(false)
                    return // Stop execution, stay on step
               }
          }

          // --- STEP 2 -> 3 TRANSITION ---
          if (currentStep < steps.length - 1) {
               await actions.setTouched({})
               actions.setSubmitting(false)
               setPaymentReady(false)
               setCurrentStep(prev => prev + 1)
               window.scrollTo(0, 0)
               return
          }
     }

     return (
          <div className="min-h-screen bg-white lg:flex font-sans text-stone-900">
               <div className="flex-1 flex flex-col h-screen overflow-y-auto relative scrollbar-hide">
                    <MobileSummaryToggle isOpen={isMobileSummaryOpen} onToggle={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)} shippingCost={shippingCost} />

                    <div className="flex-grow px-6 py-12 md:px-12 lg:px-24">
                         <div className="max-w-xl mx-auto">
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

                              <Formik initialValues={initialValues} validationSchema={validationSchemas[currentStep]} onSubmit={handleFormSubmit} enableReinitialize>
                                   {formik => (
                                        <Form>
                                             <FormPersister />

                                             <div className="min-h-[400px]">
                                                  {currentStep === 0 && <StepContact />}
                                                  {/* Removed setters from props, StepShipping is now purely presentation */}
                                                  {currentStep === 1 && <StepShipping />}
                                                  {currentStep === 2 && <StepBilling />}
                                                  {currentStep === 3 && <StepPayment onReady={setPaymentReady} />}
                                             </div>

                                             {/* Error Message for Shipping Failure */}
                                             {shippingError && currentStep === 1 && (
                                                  <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800 animate-in fade-in slide-in-from-bottom-2">
                                                       <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                                       <span className="text-sm font-medium">{shippingError}</span>
                                                  </div>
                                             )}

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
                                                       disabled={formik.isSubmitting || (currentStep === 3 && !paymentReady) || isShippingLoading}
                                                       className="bg-stone-900 text-white w-full md:w-auto px-10 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-stone-800 transition-all shadow-lg hover:shadow-stone-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                  >
                                                       {formik.isSubmitting || isShippingLoading ? (
                                                            <>
                                                                 <Loader2 className="w-4 h-4 animate-spin" />
                                                                 <span>{isShippingLoading ? "Calculating Rate..." : "Processing..."}</span>
                                                            </>
                                                       ) : currentStep === 1 ? (
                                                            "Calculate Shipping & Next"
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
               </div>
               <OrderSummary shippingCost={shippingCost} isLoading={isShippingLoading} />
          </div>
     )
}

export default CheckoutPage
