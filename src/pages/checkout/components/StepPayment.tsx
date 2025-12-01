import { useContext, useEffect, useRef, useState } from "react"
import { useFormikContext } from "formik"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import type { CheckoutValues } from "@pages/checkout/CheckoutPage.tsx"
import axios from "axios"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AppContext } from "../../../app/App.tsx"
import { ORDERS_CREATE_ENDPOINT, PAYMENT_INTENT_ENDPOINT } from "@endpoints"
import { AlertCircle, Loader2 } from "lucide-react"
import { STRIPE_PUBLIC_KEY } from "@constants"
import { isCustomAxiosError } from "../../../app/core/axiosCustomInterceptor.ts"

// Initialize Stripe outside component
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

// --- 1. LOGIC HANDLER (Child of Elements) ---
interface HandlerProps {
     clientSecret: string
     onError: (message: string) => void
}

const StripeSubmissionHandler = ({ clientSecret, onError }: HandlerProps) => {
     const stripe = useStripe()
     const elements = useElements()
     const { values, isSubmitting, setSubmitting } = useFormikContext<CheckoutValues>()

     const { cartItems, coupon } = useContext(AppContext)

     const navigate = useNavigate()

     useEffect(() => {
          if (isSubmitting && stripe && elements && clientSecret) {
               const processOrder = async () => {
                    try {
                         // A. Retrieve Payment Intent
                         const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)
                         if (!paymentIntent) throw new Error("Could not retrieve payment details.")

                         // B. Create Order in Backend
                         const billingData = values.billing.sameAsShipping ? values.shipping : values.billing

                         await axios.post(ORDERS_CREATE_ENDPOINT, {
                              items: cartItems,
                              shippingAddress: values.shipping,
                              billingAddress: billingData,
                              paymentIntentId: paymentIntent.id,
                              email: values.email,
                              firstName: values.shipping.firstName,
                              lastName: values.shipping.lastName,
                              couponCode: coupon?.code,
                         })

                         // C. Confirm Payment
                         const { error } = await stripe.confirmPayment({
                              elements,
                              confirmParams: { return_url: window.location.origin + "/order-success" },
                              redirect: "if_required",
                         })

                         if (error) {
                              console.error("Stripe Error:", error.message)
                              onError(error.message || "Payment failed.")
                              setSubmitting(false)
                         } else {
                              navigate("/order-success")
                         }
                    } catch (err) {
                         console.error("Order Processing Error:", err)

                         const defaultMessageError = "Failed to process order. Please try again."

                         if (isCustomAxiosError(err)) {
                              onError(err.customError?.message || defaultMessageError)
                         } else if (err instanceof Error) {
                              onError(err.message)
                         } else {
                              onError(defaultMessageError)
                         }

                         setSubmitting(false)
                    }
               }
               processOrder()
          }
     }, [isSubmitting, stripe, elements, clientSecret, values, cartItems, coupon, navigate, setSubmitting, onError])

     return null
}

// --- 2. INNER FORM UI (Child of Elements) ---
const PaymentFormContent = ({ clientSecret, onError }: { clientSecret: string; onError: (msg: string) => void }) => {
     const { isSubmitting } = useFormikContext<CheckoutValues>()

     return (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 md:p-8 relative overflow-hidden">
               {/* Loader Overlay */}
               {isSubmitting && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center text-stone-900 animate-in fade-in duration-200">
                         <Loader2 className="w-10 h-10 animate-spin mb-3" strokeWidth={1.5} />
                         <span className="text-xs font-bold uppercase tracking-widest">Processing Payment...</span>
                    </div>
               )}

               <StripeSubmissionHandler clientSecret={clientSecret} onError={onError} />

               <PaymentElement options={{ layout: "tabs", terms: { card: "never" } }} />
          </div>
     )
}

// --- 3. MAIN CONTAINER (Central Error Management) ---
const StepPayment = ({ onReady }: { onReady: (isReady: boolean) => void }) => {
     const { cartItems, coupon } = useContext(AppContext) // Get Coupon
     const [clientSecret, setClientSecret] = useState<string | null>(null)
     const [errorMessage, setErrorMessage] = useState<string | null>(null)
     const [searchParams] = useSearchParams()
     const { isSubmitting } = useFormikContext<CheckoutValues>()

     // Track if fetch has started to prevent double-firing in Strict Mode
     const hasFetchedRef = useRef(false)
     // Track the last coupon used to trigger refetch if it changes
     const lastCouponCodeRef = useRef<string | undefined>(undefined)

     // Clear errors when user tries again
     useEffect(() => {
          if (isSubmitting) setErrorMessage(null)
     }, [isSubmitting])

     // Check for Redirect Failures
     useEffect(() => {
          const redirectStatus = searchParams.get("redirect_status")
          if (redirectStatus === "failed") {
               setErrorMessage("The payment was canceled or failed. Please try again.")
          }
     }, [searchParams])

     // 3. Reset Payment Intent if Coupon Changes
     // If the user adds/removes a coupon, we MUST regenerate the Payment Intent with the new price
     useEffect(() => {
          if (coupon?.code !== lastCouponCodeRef.current) {
               setClientSecret(null) // Unmount Stripe Elements
               hasFetchedRef.current = false // Allow fetching again
               onReady(false)
               lastCouponCodeRef.current = coupon?.code
          }
     }, [coupon, onReady])

     // 4. Initialize Payment Intent
     useEffect(() => {
          // Prevent running if secret exists or fetch already started
          if (clientSecret || hasFetchedRef.current) return

          hasFetchedRef.current = true
          onReady(false)

          axios.post(PAYMENT_INTENT_ENDPOINT, {
               items: cartItems,
               couponCode: coupon?.code, // Send Coupon to Backend for Price Calculation
          })
               .then(res => {
                    setClientSecret(res.data.clientSecret)
                    onReady(true)
               })
               .catch(err => {
                    const defaultMessageError = "Could not initialize payment system. Please check your connection."
                    if (isCustomAxiosError(err)) {
                         setErrorMessage(err.customError?.message || defaultMessageError)
                    } else {
                         setErrorMessage(defaultMessageError)
                    }
                    onReady(false)
                    hasFetchedRef.current = false
               })
     }, [clientSecret, cartItems, coupon, onReady]) // Add coupon dependency

     return (
          <div className="animate-fade-in">
               <h2 className="font-serif text-3xl text-stone-900 mb-2">Payment</h2>
               <p className="text-stone-500 text-sm mb-8">All transactions are secure and encrypted.</p>

               {/* Unified Error Banner */}
               {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800 animate-in slide-in-from-top-2">
                         <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                         <div className="text-sm font-medium leading-relaxed">{errorMessage}</div>
                    </div>
               )}

               {/* Content State Handling */}
               {!clientSecret && !errorMessage ? (
                    <div className="h-60 flex items-center justify-center text-stone-400 text-sm animate-pulse border border-stone-100 rounded-xl bg-stone-50">
                         {coupon ? "Applying discount and preparing payment..." : "Preparing secure payment..."}
                    </div>
               ) : clientSecret ? (
                    <Elements
                         stripe={stripePromise}
                         options={{
                              clientSecret,
                              appearance: {
                                   theme: "stripe",
                                   variables: { colorPrimary: "#1c1917", fontFamily: '"Lato", sans-serif' },
                              },
                         }}
                    >
                         <PaymentFormContent clientSecret={clientSecret} onError={setErrorMessage} />
                    </Elements>
               ) : null}
          </div>
     )
}

export default StepPayment
