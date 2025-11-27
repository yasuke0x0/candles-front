import { useContext, useEffect, useState } from "react"
import { useFormikContext } from "formik"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import type { CheckoutValues } from "@pages/checkout/CheckoutPage.tsx"
import axios from "axios"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AppContext } from "../../../app/App.tsx"
import { ORDERS_CREATE_ENDPOINT } from "@endpoints"
import { AlertCircle, Loader2 } from "lucide-react"

// --- LOGIC HANDLER ---
interface HandlerProps {
     clientSecret: string
     onError: (message: string) => void
}

const StripeSubmissionHandler = ({ clientSecret, onError }: HandlerProps) => {
     const stripe = useStripe()
     const elements = useElements()
     const { values, isSubmitting, setSubmitting } = useFormikContext<CheckoutValues>()
     const { cartItems } = useContext(AppContext)
     const navigate = useNavigate()

     useEffect(() => {
          // Only run when Formik is submitting and Stripe is ready
          if (isSubmitting && stripe && elements && clientSecret) {
               const processOrder = async () => {
                    try {
                         // 1. GET PAYMENT INTENT ID
                         const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)

                         if (!paymentIntent) {
                              throw new Error("Could not retrieve payment details.")
                         }

                         // 2. CREATE ORDER IN BACKEND
                         const billingData = values.billing.sameAsShipping ? values.shipping : values.billing

                         await axios.post(ORDERS_CREATE_ENDPOINT, {
                              items: cartItems,
                              shippingAddress: values.shipping,
                              billingAddress: billingData,
                              paymentIntentId: paymentIntent.id,
                              email: values.email,
                              firstName: values.shipping.firstName,
                              lastName: values.shipping.lastName,
                         })

                         // 3. CONFIRM PAYMENT WITH STRIPE
                         const { error } = await stripe.confirmPayment({
                              elements,
                              confirmParams: {
                                   return_url: window.location.origin + "/order-success",
                              },
                              redirect: "if_required",
                         })

                         if (error) {
                              console.error("Stripe Error:", error.message)
                              onError(error.message || "Payment failed. Please try again.")
                              setSubmitting(false)
                         } else {
                              // 4. SUCCESS
                              navigate("/order-success")
                         }
                    } catch (err) {
                         console.error("Order Processing Error:", err)
                         const msg = axios.isAxiosError(err) && err.response?.data?.message
                              ? err.response.data.message
                              : "Failed to process order. Please try again."

                         onError(msg)
                         setSubmitting(false)
                    }
               }

               processOrder()
          }
     }, [isSubmitting, stripe, elements, clientSecret, values, cartItems, navigate, setSubmitting, onError])

     return null
}

// --- MAIN COMPONENT ---
const StepPayment = ({ clientSecret }: { clientSecret: string }) => {
     const [errorMessage, setErrorMessage] = useState<string | null>(null)
     const { isSubmitting } = useFormikContext<CheckoutValues>()
     const [searchParams] = useSearchParams()

     // 1. Check for Redirect Failures (e.g. 3D Secure / PayPal failed)
     useEffect(() => {
          const redirectStatus = searchParams.get("redirect_status")
          if (redirectStatus === "failed") {
               setErrorMessage("The payment was canceled or failed. Please try again or use a different payment method.")
          }
     }, [searchParams])

     // 2. Clear error when user starts submitting again
     useEffect(() => {
          if (isSubmitting) setErrorMessage(null)
     }, [isSubmitting])

     return (
          <div className="animate-fade-in">
               <h2 className="font-serif text-3xl text-stone-900 mb-2">Payment</h2>
               <p className="text-stone-500 text-sm mb-8">All transactions are secure and encrypted.</p>

               <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 md:p-8 relative overflow-hidden">
                    {/* Loader Overlay */}
                    {isSubmitting && (
                         <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center text-stone-900 animate-in fade-in duration-200">
                              <Loader2 className="w-10 h-10 animate-spin mb-3" strokeWidth={1.5} />
                              <span className="text-xs font-bold uppercase tracking-widest">Processing Payment...</span>
                         </div>
                    )}

                    {/* Error Message Banner */}
                    {errorMessage && (
                         <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800 animate-in slide-in-from-top-2">
                              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                              <div className="text-sm font-medium leading-relaxed">{errorMessage}</div>
                         </div>
                    )}

                    {/* Logic Wrapper */}
                    <StripeSubmissionHandler
                         clientSecret={clientSecret}
                         onError={setErrorMessage}
                    />

                    {/* UI Elements */}
                    <PaymentElement
                         options={{
                              layout: "tabs",
                              terms: { card: "never" },
                         }}
                    />
               </div>
          </div>
     )
}

export default StepPayment
