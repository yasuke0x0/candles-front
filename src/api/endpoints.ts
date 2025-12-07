const BASE_ENDPOINT = import.meta.env.VITE_API_BASE_ENDPOINT

export const LOGIN_ENDPOINT = `${BASE_ENDPOINT}/login`
export const AUTH_ME_ENDPOINT = `${BASE_ENDPOINT}/auth/me`

const USERS_ENDPOINT = `${BASE_ENDPOINT}/users`
export const USERS_SAVE_CONTACT_ENDPOINT = `${USERS_ENDPOINT}/save-contact`

// Public Products
export const PRODUCTS_LIST_ENDPOINT = `${BASE_ENDPOINT}/products`

// Admin Products (New)
export const ADMIN_PRODUCTS_LIST_ENDPOINT = `${BASE_ENDPOINT}/admin/products`
export const PRODUCT_ARCHIVE_ENDPOINT = (id: number) => `${BASE_ENDPOINT}/products/${id}/archive`
export const PRODUCT_RESTORE_ENDPOINT = (id: number) => `${BASE_ENDPOINT}/products/${id}/restore`

export const ORDERS_CREATE_ENDPOINT = `${BASE_ENDPOINT}/orders`

export const PAYMENT_INTENT_ENDPOINT = `${BASE_ENDPOINT}/create-payment-intent`

export const SHIPPING_ENDPOINT = `${BASE_ENDPOINT}/shipping`
export const SHIPPING_RATES_ENDPOINT = `${SHIPPING_ENDPOINT}/rates`

export const COUPONS_ENDPOINT = `${BASE_ENDPOINT}/coupons`
export const COUPONS_CHECK_ENDPOINT = `${COUPONS_ENDPOINT}/check`

export const DISCOUNTS_LIST_ENDPOINT = `${BASE_ENDPOINT}/discounts`

export const ORDERS_LIST_ENDPOINT = `${BASE_ENDPOINT}/orders`
export const ORDER_DETAILS_ENDPOINT = (id: number) => `${ORDERS_LIST_ENDPOINT}/${id}`
