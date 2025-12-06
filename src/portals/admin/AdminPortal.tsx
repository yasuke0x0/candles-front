import { Route, Routes } from "react-router-dom"
// REMOVED: import { BrowserRouter } ...

const AdminPortal = () => {
     return (
          <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
               {/* Define Admin Routes here directly or import AdminRoutes */}
               <Routes>
                    <Route path="/" element={<div>Dashboard Home (Admin)</div>} />
                    <Route path="/products" element={<div>Product Manager</div>} />
               </Routes>
          </div>
     )
}

export default AdminPortal
