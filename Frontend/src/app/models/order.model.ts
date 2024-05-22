export interface OrderInterface {
    id: number;
    userId: string;
    isConfirmed: boolean;
    orderDetails: OrderDetailInterface[];
    orderPrice: number;
}

export interface OrderDetailInterface {
    productId: number;
    quantity: number;
}