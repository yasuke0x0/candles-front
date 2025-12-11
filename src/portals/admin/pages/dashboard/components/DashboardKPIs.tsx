import { DollarSign, ShoppingBag, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react"

interface KPIItem {
     value: number
     growth: number
     previous: number
}

interface DashboardKPIsProps {
     kpi: {
          revenue: KPIItem
          orders: KPIItem
          customers: KPIItem
          aov: KPIItem
     }
     variant?: "row" | "grid"
}

const KPICard = ({ title, value, growth, prefix = "", icon: Icon }: any) => {
     const isPositive = growth >= 0
     const isEmpty = value === 0

     return (
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all h-full">
               <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                         isEmpty
                              ? "bg-stone-50 text-stone-300" // Muted icon if empty
                              : "bg-stone-50 text-stone-900 group-hover:bg-stone-900 group-hover:text-white"
                    }`}>
                         <Icon size={20} />
                    </div>
                    {/* Only show growth badge if there is actual data or growth history */}
                    {growth !== 0 && !isEmpty && (
                         <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(growth)}%
                         </div>
                    )}
               </div>
               <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">{title}</p>
                    <h3 className={`text-2xl font-serif ${isEmpty ? "text-stone-300" : "text-stone-900"}`}>
                         {prefix}
                         {typeof value === "number" ? value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : value}
                    </h3>
               </div>
          </div>
     )
}

const DashboardKPIs = ({ kpi, variant = "row" }: DashboardKPIsProps) => {
     if (!kpi) return null

     const gridClasses = variant === "row"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2"

     return (
          <div className={`grid ${gridClasses} gap-4 h-full`}>
               <KPICard
                    title="Total Revenue"
                    value={kpi.revenue.value}
                    growth={kpi.revenue.growth}
                    prefix="€"
                    icon={DollarSign}
               />
               <KPICard
                    title="Total Orders"
                    value={kpi.orders.value}
                    growth={kpi.orders.growth}
                    icon={ShoppingBag}
               />
               <KPICard
                    title="New Customers"
                    value={kpi.customers.value}
                    growth={kpi.customers.growth}
                    icon={Users}
               />
               <KPICard
                    title="Avg. Order Value"
                    value={kpi.aov.value}
                    growth={kpi.aov.growth}
                    prefix="€"
                    icon={Wallet}
               />
          </div>
     )
}

export default DashboardKPIs
