import ScrollHandler from "@components/ScrollHandler.tsx"
import Cursor from "@components/Cursor.tsx"
import AdminRoutes from "./AdminRoutes"
// REMOVE: AdminAuthProvider is not imported here if we use it inside AdminRoutes wrapper logic
// BUT, since we need 'useNavigate' inside the Provider, the Provider must be inside a Router.
// Since App.tsx provides the Router, we can place the Provider here.
import { AdminAuthProvider } from "./core/AdminAuthContext"

const AdminPortal = () => {
     return (
          <AdminAuthProvider>
               <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
                    <ScrollHandler />
                    <Cursor />
                    <AdminRoutes />
               </div>
          </AdminAuthProvider>
     )
}

export default AdminPortal
