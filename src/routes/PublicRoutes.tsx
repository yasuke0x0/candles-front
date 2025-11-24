import { Route, Routes } from "react-router-dom"
import { LandingPage } from "@pages/landing/LandingPage.tsx"
import CartPage from "@pages/cart/CartPage.tsx"
import CheckoutPage from "@pages/checkout/CheckoutPage.tsx"

const PublicRoutes = () => {
     return (
          <Routes>
               {/* Landing Page */}
               <Route path="/" element={<LandingPage />} />

               {/* Cart Page */}
               <Route path="/cart" element={<CartPage />} />

               {/* Checkout Page */}
               <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
     )
}

export default PublicRoutes
