import type { ICartItemModel, ICoupon } from "@models"
import { type Dispatch, type SetStateAction } from "react"

export interface IAppContext {
     cartItems: ICartItemModel[]
     setCartItems: Dispatch<SetStateAction<ICartItemModel[]>>
     isCartOpen: boolean
     setIsCartOpen: Dispatch<SetStateAction<boolean>>
     coupon: ICoupon | null
     setCoupon: Dispatch<SetStateAction<ICoupon | null>>
}
