import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { subDays, format } from "date-fns"

import DashboardHeader from "./components/DashboardHeader.tsx"
import DashboardKPIs from "./components/DashboardKPIs.tsx"
import DashboardChart from "./components/DashboardChart.tsx"
import DashboardRecentOrders from "./components/DashboardRecentOrders.tsx"
import DashboardTopProducts from "./components/DashboardTopProducts.tsx"
import DashboardLowStock from "./components/DashboardLowStock.tsx"
import { DASHBOARD_STATS_ENDPOINT } from "@api-endpoints"

const Dashboard = () => {
     const [dateRange, setDateRange] = useState({
          start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
          end: format(new Date(), "yyyy-MM-dd"),
     })

     const { data, isLoading, isFetching } = useQuery({
          queryKey: ["admin-dashboard", dateRange],
          queryFn: async () => {
               const params = { startDate: dateRange.start, endDate: dateRange.end }
               const res = await axios.get(DASHBOARD_STATS_ENDPOINT, { params })
               return res.data
          },
     })

     if (isLoading) {
          return (
               <div className="h-full flex flex-col items-center justify-center bg-stone-50 text-stone-400 gap-4">
                    <Loader2 className="animate-spin" size={40} />
                    <span className="text-xs font-bold uppercase tracking-widest">Loading Analytics...</span>
               </div>
          )
     }

     return (
          // Added ID for scroll detection
          <div id="dashboard-scroll-container" className="h-full flex flex-col bg-stone-50/50 font-sans overflow-y-auto scrollbar-thin relative">

               <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />

               {isFetching && !isLoading && (
                    <div className="absolute top-[72px] left-0 right-0 h-1 bg-stone-100 overflow-hidden z-20">
                         <div className="h-full bg-stone-900 animate-loading-bar" />
                    </div>
               )}

               <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 pb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                         <DashboardKPIs kpi={data?.kpi} />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                              <DashboardChart data={data?.chart} />
                         </motion.div>

                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                              <DashboardLowStock products={data?.lowStockProducts} />
                         </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                              <DashboardRecentOrders orders={data?.recentOrders} />
                         </motion.div>

                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                              <DashboardTopProducts products={data?.topProducts} />
                         </motion.div>
                    </div>
               </main>
          </div>
     )
}

export default Dashboard
