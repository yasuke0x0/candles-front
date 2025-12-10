import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { AnimatePresence } from "framer-motion"
import CustomersHeader from "./components/CustomersHeader"
import CustomersTable from "./components/CustomersTable"
import CustomersMobileList from "./components/CustomersMobileList"
import CustomerDetailsModal from "./components/CustomerDetailsModal"
import CustomersPagination from "@portals/admin/pages/orders/components/OrdersPagination"
import { CUSTOMERS_LIST_ENDPOINT } from "@api-endpoints" // Reusing your existing pagination

// Define the shape of data returned by AdminCustomersController
export interface ICustomerStats {
     totalOrders: number
     totalSpent: number
}

export interface ICustomerWithStats {
     id: number
     email: string
     firstName: string | null
     lastName: string | null
     createdAt: string
     stats: ICustomerStats
}

function useDebounce<T>(value: T, delay: number): T {
     const [debouncedValue, setDebouncedValue] = useState(value)
     useEffect(() => {
          const handler = setTimeout(() => setDebouncedValue(value), delay)
          return () => clearTimeout(handler)
     }, [value, delay])
     return debouncedValue
}

const Customers = () => {
     // State
     const [page, setPage] = useState(1)
     const [limit, setLimit] = useState(15)
     const [searchTerm, setSearchTerm] = useState("")
     const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

     const debouncedSearch = useDebounce(searchTerm, 500)

     // Data Fetching
     const { data, isLoading } = useQuery({
          queryKey: ["admin-customers", page, limit, debouncedSearch],
          queryFn: async () => {
               const params: any = { page, limit }
               if (debouncedSearch) params.search = debouncedSearch

               // Artificial delay for smooth skeleton transition
               const [res] = await Promise.all([axios.get(CUSTOMERS_LIST_ENDPOINT, { params }), new Promise(resolve => setTimeout(resolve, 300))])
               return res.data
          },
     })

     const customers: ICustomerWithStats[] = data?.data || []
     const meta = data?.meta

     return (
          <div className="h-full flex flex-col bg-stone-50/50 font-sans relative">
               <CustomersHeader totalCustomers={meta?.total} isLoading={isLoading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

               <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-stone-200">
                    <div className="max-w-7xl mx-auto space-y-6">
                         {/* Desktop Table */}
                         <CustomersTable customers={customers} isLoading={isLoading} onViewDetails={setSelectedCustomerId} />

                         {/* Mobile Cards */}
                         <CustomersMobileList customers={customers} isLoading={isLoading} onViewDetails={setSelectedCustomerId} />

                         {/* Pagination */}
                         <CustomersPagination meta={meta} limit={limit} setLimit={setLimit} setPage={setPage} pageSizeOptions={[15, 25, 50]} />
                    </div>
               </div>

               {/* Details Modal */}
               <AnimatePresence>{selectedCustomerId && <CustomerDetailsModal customerId={selectedCustomerId} onClose={() => setSelectedCustomerId(null)} />}</AnimatePresence>
          </div>
     )
}

export default Customers
