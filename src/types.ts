export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    scentNotes: string[];
    burnTime: string;
    isNew?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

export type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    toggleCart: () => void;
    isCartOpen: boolean;
    cartTotal: number;
    cartCount: number;
};
