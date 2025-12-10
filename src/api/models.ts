// --- ADDRESS ---
export interface IAddress {
     id: number
     userId: number
     firstName: string | null
     lastName: string | null
     companyName: string | null
     streetAddressLineOne: string
     streetAddressLineTwo: string | null
     city: string
     postalCode: string
     country: string
     type: 'SHIPPING' | 'BILLING'
     phonePrefix: string | null
     phone: string | null
     createdAt: string
     updatedAt: string
}

// --- USER ---
export interface IUser {
     id: number
     email: string
     firstName: string | null
     lastName: string | null
     newsletter: boolean
     roles: ('SUPER_ADMIN' | 'CUSTOMER')[]
     createdAt: string
     updatedAt: string | null
     addresses?: IAddress[]
     orders?: IOrder[]
}

// --- DISCOUNTS & HISTORY ---
export interface IDiscount {
     id: number
     name: string
     type: 'PERCENTAGE' | 'FIXED'
     value: number
     isActive: boolean
     startsAt: string | null
     endsAt: string | null
     createdAt: string
     updatedAt: string
}

export interface IDiscountHistory {
     id: number
     productId: number
     discountId: number | null
     discountName: string
     discountType: string
     discountValue: number
     originalPrice: number
     discountedPrice: number
     appliedAt: string
     removedAt: string | null
}

// --- PRODUCTS ---
export interface IProductModel {
     id: number
     name: string
     description: string
     image: string
     burnTime: string
     isNew: boolean

     // Status
     status: 'ACTIVE' | 'ARCHIVED'

     // Inventory
     stock: number
     isOutOfStock?: boolean // Computed

     // Pricing & Dimensions
     price: number
     vatRate: number
     priceNet: number
     weight: number
     length: number
     width: number
     height: number

     // Computed / formatted
     currentPrice?: number
     formattedPrice?: string

     // Meta
     scentNotes: string[]
     createdAt: string
     updatedAt: string

     // Relations
     discounts?: IDiscount[]
     discountHistory?: IDiscountHistory[]
}

export interface ICartItemModel extends IProductModel {
     quantity: number
}

// --- INVENTORY ---
export interface IInventoryMovement {
     id: number
     productId: number
     userId: number | null
     orderId: number | null
     quantity: number
     type: 'SALE' | 'RESTOCK' | 'MANUAL_ADJUSTMENT' | 'RETURN' | 'DAMAGED'
     reason: string | null
     stockAfter: number
     createdAt: string
     updatedAt: string

     product?: IProductModel
     user?: IUser
     order?: IOrder
}

// --- COUPONS ---
export interface ICoupon {
     id: number
     code: string
     description: string | null
     type: 'PERCENTAGE' | 'FIXED'
     value: number
     minOrderAmount: number
     maxUses: number | null
     maxUsesPerUser: number
     currentUses: number
     isActive: boolean
     startsAt: string | null
     endsAt: string | null
     createdAt: string
     updatedAt: string
}

// --- ORDERS ---
export interface IOrderItem {
     id: number
     orderId: number
     productId: number | null
     productName: string
     quantity: number

     // Pricing Snapshots
     price: number
     priceNet: number
     vatRate: number
     vatAmount: number
     totalPrice: number

     // Discount Snapshots
     discountAmount: number
     discountDescription: string | null

     createdAt: string
     updatedAt: string

     product?: IProductModel
}

export interface IOrder {
     id: number
     userId: number
     shippingAddressId: number
     billingAddressId: number

     // Financials
     totalAmount: number
     amountWithoutVat: number
     vatAmount: number
     shippingAmount: number
     totalDiscount: number

     // Meta
     status:
          | 'canceled'
          | 'created'
          | 'partially_funded'
          | 'payment_failed'
          | 'processing'
          | 'requires_action'
          | 'succeeded'
          | 'READY_TO_SHIP'
          | 'SHIPPED'
          | string
     paymentIntentId: string | null

     // Coupon info
     couponId: number | null
     couponDiscountAmount: number

     createdAt: string
     updatedAt: string

     // Relations
     user?: IUser
     shippingAddress?: IAddress
     billingAddress?: IAddress
     items?: IOrderItem[]
     coupon?: ICoupon
}
