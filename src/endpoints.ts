const BASE_ENDPOINT = import.meta.env.VITE_API_BASE_ENDPOINT

export const PRODUCTS_LIST_ENDPOINT = `${BASE_ENDPOINT}/products`

export const ORDERS_CREATE_ENDPOINT = `${BASE_ENDPOINT}/orders`

export const PAYMENT_INTENT_ENDPOINT = `${BASE_ENDPOINT}/create-payment-intent`
