import { lazy } from "react"
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import AdminLayout from "./components/AdminLayout"
import AdminLoader from "./components/AdminLoader"
import { useAdminAuth } from "./core/AdminAuthContext"
import LoginPage from "@portals/admin/components/LoginPage.tsx"

// --- DELAY HELPER ---
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const lazyWithDelay = (importFunc: any) => lazy(() => Promise.all([importFunc, wait(800)]).then(([moduleExports]) => moduleExports))

// Lazy Load Pages
const Dashboard = lazyWithDelay(import("./pages/Dashboard"))
const Products = lazyWithDelay(import("./pages/products/Products"))
const Coupons = lazyWithDelay(import("./pages/coupons/Coupons"))
const Orders = lazyWithDelay(import("./pages/orders/Orders"))
const Customers = lazyWithDelay(import("./pages/customers/Customers"))

// --- GUARDS ---

const RequireAuth = () => {
     const { isAuthenticated, isLoading } = useAdminAuth()
     const location = useLocation()

     if (isLoading) return <AdminLoader />

     return isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" state={{ from: location }} replace />
}

const RequireGuest = () => {
     const { isAuthenticated, isLoading } = useAdminAuth()
     const location = useLocation()

     // FIX: Check if we have a "return to" address in the state, otherwise default to /admin
     const from = location.state?.from?.pathname || "/admin"

     if (isLoading) return <AdminLoader />

     // If logged in -> Redirect to 'from' (which might be /admin/products) instead of always /admin
     return !isAuthenticated ? <Outlet /> : <Navigate to={from} replace />
}

const AdminRoutes = () => {
     return (
          <Routes>
               {/* Guest Routes (Login) */}
               <Route element={<RequireGuest />}>
                    <Route path="login" element={<LoginPage />} />
               </Route>

               {/* Protected Routes */}
               <Route element={<RequireAuth />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="coupons" element={<Coupons />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
               </Route>
          </Routes>
     )
}

export default AdminRoutes
