import { lazy, Suspense } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { BrowserRouter, Route, Routes } from "react-router-dom" // Import Router parts
import "./api/axiosCustomInterceptor.ts"

// Lazy Load Portals
const CustomerPortal = lazy(() => import("./portals/customer/CustomerPortal.tsx"))
const AdminPortal = lazy(() => import("./portals/admin/AdminPortal.tsx"))

const queryClient = new QueryClient({
     defaultOptions: {
          queries: {
               retry: false,
               refetchOnWindowFocus: false,
          },
     },
})

const App = () => {
     return (
          <QueryClientProvider client={queryClient}>
               {/* 1. Lift BrowserRouter to the top level */}
               <BrowserRouter>
                    <Suspense
                         fallback={
                              <div className="h-screen w-full flex items-center justify-center bg-stone-50">
                                   <Loader2 className="animate-spin text-stone-400" size={32} />
                              </div>
                         }
                    >
                         <Routes>
                              {/* 2. Admin Routes: Matches /admin AND anything after it */}
                              <Route path="/admin/*" element={<AdminPortal />} />

                              {/* 3. Customer Routes: Catch-all for everything else */}
                              <Route path="/*" element={<CustomerPortal />} />
                         </Routes>
                    </Suspense>
               </BrowserRouter>
          </QueryClientProvider>
     )
}

export { App }
