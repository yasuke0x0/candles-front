import { lazy } from "react"
import { Route, Routes } from "react-router-dom"
import { LandingPage } from "./pages/landing/LandingPage"
import CartPage from "./pages/cart/CartPage.tsx"
import OrderSuccessPage from "./pages/order/OrderSuccessPage.tsx"

// 1. Lazy load the CheckoutPage
// This creates a separate chunk that only loads when requested
const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage.tsx"))

const CustomerRoutes = () => {
     return (
          <Routes>
               {/* Landing Page */}
               <Route path="/" element={<LandingPage />} />

               {/* Cart Page */}
               <Route path="/cart" element={<CartPage />} />

               {/* Checkout Page */}
               <Route path="/checkout" element={<CheckoutPage />} />

               {/* Order success Page */}
               <Route path="/order-success" element={<OrderSuccessPage />} />
          </Routes>
     )
}

export default CustomerRoutes
