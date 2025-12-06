import { lazy } from "react"
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import AdminLayout from "./components/AdminLayout"
import AdminLoader from "./components/AdminLoader"
import { useAdminAuth } from "./core/AdminAuthContext"
import LoginPage from "@portals/admin/components/LoginPage.tsx"

// --- DELAY HELPER (Simulate network delay for demo/loader visibility) ---
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const lazyWithDelay = (importFunc: any) => lazy(() => Promise.all([importFunc, wait(800)]).then(([moduleExports]) => moduleExports))

// Lazy Load Pages
const Dashboard = lazyWithDelay(import("./pages/Dashboard"))
const Products = lazyWithDelay(import("./pages/products/Products"))
// const Orders = lazyWithDelay(import("./pages/OrdersManager"))
// const Customers = lazyWithDelay(import("./pages/CustomersManager"))
// const Coupons = lazyWithDelay(import("./pages/CouponsManager"))

// --- GUARDS ---

const RequireAuth = () => {
     const { isAuthenticated, isLoading } = useAdminAuth()
     const location = useLocation() // Capture the current page

     if (isLoading) return <AdminLoader />

     // If logged in -> Show Layout
     // If NOT logged in -> Redirect to Login AND remember where they were (state={{ from: location }})
     return isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" state={{ from: location }} replace />
}

const RequireGuest = () => {
     const { isAuthenticated, isLoading } = useAdminAuth()

     if (isLoading) return <AdminLoader />

     // If NOT logged in -> Show Login Page (Outlet)
     // If logged in -> Redirect to Dashboard immediately
     return !isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />
}

const AdminRoutes = () => {
     return (
          <Routes>
               {/* Guest Routes (Login) */}
               {/* Wrapped in RequireGuest so logged-in users cannot see the login page */}
               <Route element={<RequireGuest />}>
                    <Route path="login" element={<LoginPage />} />
               </Route>

               {/* Protected Routes (Dashboard) */}
               {/* Wrapped in RequireAuth to ensure security */}
               <Route element={<RequireAuth />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    {/* <Route path="orders" element={<Orders />} /> */}
                    {/* <Route path="customers" element={<Customers />} /> */}
                    {/* <Route path="coupons" element={<Coupons />} /> */}
               </Route>
          </Routes>
     )
}

export default AdminRoutes
