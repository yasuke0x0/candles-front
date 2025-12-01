const BASE_ENDPOINT = import.meta.env.VITE_API_BASE_ENDPOINT

const USERS_ENDPOINT = `${BASE_ENDPOINT}/users`
export const USERS_SAVE_CONTACT_ENDPOINT = `${USERS_ENDPOINT}/save-contact`

export const PRODUCTS_LIST_ENDPOINT = `${BASE_ENDPOINT}/products`

export const ORDERS_CREATE_ENDPOINT = `${BASE_ENDPOINT}/orders`

export const PAYMENT_INTENT_ENDPOINT = `${BASE_ENDPOINT}/create-payment-intent`

export const COUPONS_ENDPOINT = `${BASE_ENDPOINT}/coupons`
export const COUPONS_CHECK_ENDPOINT = `${COUPONS_ENDPOINT}/check`
