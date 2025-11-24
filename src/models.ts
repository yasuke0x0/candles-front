export interface IProductModel {
     id: number
     name: string
     description: string
     price: number
     image: string
     scentNotes: string[]
     burnTime: string
     isNew?: boolean
}

export interface ICartItemModel extends IProductModel {
     quantity: number
}
