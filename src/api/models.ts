// 1. New interface for Discount matching the backend model
export interface IDiscount {
     id: number
     name: string
     type: 'PERCENTAGE' | 'FIXED'
     value: number
     isActive: boolean
     startsAt: string | null // Dates are strings in JSON
     endsAt: string | null
}

export interface IProductModel {
     id: number
     name: string
     description: string
     price: number
     currentPrice: number
     stock: number
     image: string
     scentNotes: string[]
     burnTime: string
     formattedPrice: string
     isNew: boolean
     weight: number
     length: number
     width: number
     height: number
     vatRate?: number
     createdAt: string
     discounts?: IDiscount[]
}

export interface ICartItemModel extends IProductModel {
     quantity: number
}

export interface ICoupon {
     id: number
     code: string
     type: 'PERCENTAGE' | 'FIXED'
     value: number
     description: string | null
}
