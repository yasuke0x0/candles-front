import type { ICartItemModel } from "@api-models"
import type { Dispatch, SetStateAction } from "react"

export interface ILandingPageContext {
     cartItems: ICartItemModel[]
     setCartItems: Dispatch<SetStateAction<ICartItemModel[]>>
}
