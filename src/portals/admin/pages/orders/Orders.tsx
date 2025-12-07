import { useEffect, useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"
import OrderDetailsModal from "@portals/admin/pages/orders/components/OrderDetailsModal.tsx"
import { ORDERS_LIST_ENDPOINT } from "@api-endpoints"

// Sub-components
import OrdersHeader from "./components/OrdersHeader"
import OrdersTable from "./components/OrdersTable"
import OrdersPagination from "./components/OrdersPagination"
import OrdersMobileFilter from "./components/OrdersMobileFilter"

// --- TYPES ---
export interface IOrderSummary {
     id: number
     totalAmount: string
     status: string
     createdAt: string
     items: { id: number }[]
     user: { firstName: string | null; lastName: string | null; email: string }
     shippingAddress?: { firstName: string; lastName: string }
}

export interface IMeta {
     currentPage: number
     firstPage: number
     lastPage: number
     perPage: number
     total: number
}

// --- UTILS ---
function useDebounce<T>(value: T, delay: number): T {
     const [debouncedValue, setDebouncedValue] = useState(value)
     useEffect(() => {
          const handler = setTimeout(() => setDebouncedValue(value), delay)
          return () => clearTimeout(handler)
     }, [value, delay])
     return debouncedValue
}

// --- CONSTANTS ---
const PAGE_SIZE_OPTIONS = [15, 25, 50, 100]

const TABS = [
     { label: "All", value: "ALL" },
     { label: "Paid", value: "succeeded" },
     { label: "Ready", value: "READY_TO_SHIP" },
     { label: "Shipped", value: "SHIPPED" },
     { label: "Cancelled", value: "canceled" },
]

const Orders = () => {
     const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

     // -- STATE --
     const [page, setPage] = useState(1)
     const [limit, setLimit] = useState(15)
     const [statusFilter, setStatusFilter] = useState<string>("ALL")
     const [searchTerm, setSearchTerm] = useState("")
     const [startDate, setStartDate] = useState("")
     const [endDate, setEndDate] = useState("")

     // UI States
     const [showDesktopFilters, setShowDesktopFilters] = useState(false)
     const [showMobileFilterModal, setShowMobileFilterModal] = useState(false)

     const debouncedSearch = useDebounce(searchTerm, 500)

     useEffect(() => {
          setPage(1)
     }, [statusFilter, debouncedSearch, startDate, endDate, limit])

     // --- FETCH ORDERS ---
     const {
          data: orderData,
          isLoading,
          refetch,
          isFetching,
     } = useQuery({
          queryKey: ["admin-orders", page, limit, statusFilter, debouncedSearch, startDate, endDate],
          queryFn: async () => {
               const params: any = {
                    page: page,
                    limit: limit,
               }

               if (statusFilter !== "ALL") params.status = statusFilter
               if (debouncedSearch) params.search = debouncedSearch
               if (startDate) params.startDate = startDate
               if (endDate) params.endDate = endDate

               const [res] = await Promise.all([axios.get(ORDERS_LIST_ENDPOINT, { params }), new Promise(resolve => setTimeout(resolve, 500))])

               return res.data
          },
          placeholderData: keepPreviousData,
     })

     const orders = orderData?.data || []
     const meta: IMeta | undefined = orderData?.meta

     const handleCloseModal = () => {
          setSelectedOrderId(null)
          refetch()
     }

     const activeFiltersCount = [statusFilter !== "ALL", startDate, endDate, searchTerm !== ""].filter(Boolean).length

     const clearFilters = () => {
          setStatusFilter("ALL")
          setSearchTerm("")
          setStartDate("")
          setEndDate("")
     }

     return (
          <div className="h-full flex flex-col bg-stone-50/50 font-sans relative">
               <OrdersHeader
                    totalOrders={meta?.total}
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeFiltersCount={activeFiltersCount}
                    clearFilters={clearFilters}
                    showDesktopFilters={showDesktopFilters}
                    setShowDesktopFilters={setShowDesktopFilters}
                    setShowMobileFilterModal={setShowMobileFilterModal}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    tabs={TABS}
               />

               <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-stone-200">
                    <div className="max-w-7xl mx-auto">
                         <OrdersTable
                              orders={orders}
                              isLoading={isLoading}
                              isFetching={isFetching}
                              hasFilters={activeFiltersCount > 0}
                              onClearFilters={clearFilters}
                              onOrderClick={setSelectedOrderId}
                         />

                         <OrdersPagination meta={meta} limit={limit} setLimit={setLimit} setPage={setPage} pageSizeOptions={PAGE_SIZE_OPTIONS} />
                    </div>
               </div>

               <OrderDetailsModal orderId={selectedOrderId} onClose={handleCloseModal} />

               <OrdersMobileFilter
                    isOpen={showMobileFilterModal}
                    onClose={() => setShowMobileFilterModal(false)}
                    activeFiltersCount={activeFiltersCount}
                    clearFilters={clearFilters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    tabs={TABS}
               />
          </div>
     )
}

export default Orders
