export interface IProductModel {
     id: number
     name: string
     description: string
     price: number
     currentPrice: number
     image: string
     scentNotes: string[]
     formattedPrice: string
     burnTime: string
     isNew?: boolean
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
