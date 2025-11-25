import { useContext, useState } from "react"
import { Form, Formik, type FormikHelpers } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, HelpCircle, ShieldCheck } from "lucide-react"
import { AppContext } from "../../app/App.tsx"
import { CART_STORAGE_KEY } from "@constants"
import OrderSummary from "./components/OrderSummary"
import StepContact from "./components/StepContact"
import StepShipping from "./components/StepShipping"
import StepBilling from "./components/StepBilling"
import StepPayment from "./components/StepPayment"

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
     payment: {
          cardNumber: string
          exp: string
          cvc: string
          nameOnCard: string
     }
}

const initialValues: CheckoutValues = {
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
     payment: {
          cardNumber: "",
          exp: "",
          cvc: "",
          nameOnCard: "",
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
     Yup.object({
          payment: Yup.object({
               cardNumber: Yup.string()
                    .required("Card number is required")
                    .matches(/^[0-9\s]{19}$/, "Must be 16 digits"), // Assumes formatting adds spaces
               exp: Yup.string().required("Required"),
               cvc: Yup.string().required("Required").min(3, "Invalid"),
               nameOnCard: Yup.string().required("Name is required"),
          }),
     }),
]

const CheckoutPage = () => {
     const navigate = useNavigate()
     const { setCartItems } = useContext(AppContext)
     const [currentStep, setCurrentStep] = useState(0)

     const handleBack = () => {
          if (currentStep > 0) {
               setCurrentStep(prev => prev - 1)
          }
     }

     const handleReturnToCart = () => {
          navigate("/cart")
     }

     // Formik handles the "Next" logic via onSubmit because the button is type="submit"
     const handleFormSubmit = async (values: CheckoutValues, actions: FormikHelpers<CheckoutValues>) => {
          if (currentStep === steps.length - 1) {
               // Final Submission
               console.log("Order Placed:", values)
               setCartItems([])
               localStorage.removeItem(CART_STORAGE_KEY)
               navigate("/")
               alert("Thank you for your order!")
          } else {
               // Move to next step
               actions.setTouched({}) // Clear errors for the new step
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
                              <Formik initialValues={initialValues} validationSchema={validationSchemas[currentStep]} onSubmit={handleFormSubmit}>
                                   {formik => (
                                        <Form>
                                             <div className="min-h-[400px]">
                                                  {currentStep === 0 && <StepContact />}
                                                  {currentStep === 1 && <StepShipping />}
                                                  {currentStep === 2 && <StepBilling />}
                                                  {currentStep === 3 && <StepPayment />}
                                             </div>

                                             {/* Footer Actions */}
                                             <div className="mt-16 pt-10 border-t border-stone-100 flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-4">
                                                  {/* Left Side: Back button */}
                                                  <button
                                                       type="button"
                                                       onClick={currentStep === 0 ? handleReturnToCart : handleBack}
                                                       className="group flex items-center gap-3 pl-2 pr-4 py-4 rounded-xl hover:bg-stone-50 transition-colors w-full md:w-auto justify-center md:justify-start"
                                                  >
                                                       <ChevronLeft size={18} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                                                       <div className="flex flex-col items-start text-left">
                                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] leading-none mb-1.5 transition-colors group-hover:text-stone-500">
                                                                 Back to
                                                            </span>
                                                            <span className="text-xs font-bold text-stone-900 uppercase tracking-[0.2em] leading-none">
                                                                 {currentStep === 0 ? "Cart" : steps[currentStep - 1]}
                                                            </span>
                                                       </div>
                                                  </button>

                                                  {/* Right Side: Submit Button (Triggers Validation) */}
                                                  <button
                                                       type="submit"
                                                       disabled={formik.isSubmitting}
                                                       className="bg-stone-900 text-white px-8 py-4 rounded-[2.5rem] hover:bg-stone-800 transition-all shadow-2xl shadow-stone-900/20 active:scale-95 flex flex-col items-center justify-center min-w-[180px] w-full md:w-auto disabled:opacity-70"
                                                  >
                                                       <span className="text-[10px] font-medium text-stone-400 uppercase tracking-[0.25em] leading-tight mb-1">
                                                            {currentStep === steps.length - 1 ? "Complete" : "Continue to"}
                                                       </span>
                                                       <span className="text-sm font-bold text-white uppercase tracking-[0.25em] leading-tight">
                                                            {currentStep === steps.length - 1 ? "Order" : steps[currentStep + 1]}
                                                       </span>
                                                  </button>
                                             </div>
                                        </Form>
                                   )}
                              </Formik>
                         </div>
                    </div>

                    {/* Enhanced Footer */}
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
