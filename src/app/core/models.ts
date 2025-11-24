import type { ICartItemModel } from "@models"
import { type Dispatch, type SetStateAction } from "react"

export interface IAppContext {
     cartItems: ICartItemModel[]
     setCartItems: Dispatch<SetStateAction<ICartItemModel[]>>
     isCartOpen: boolean
     setIsCartOpen: Dispatch<SetStateAction<boolean>>
}
