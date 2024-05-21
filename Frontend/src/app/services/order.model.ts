export interface OrderInterface {
    id: number,
    userId: string,
    isConfirmed: boolean,
    orderDetails: OrderDetailsInterface[]
}

export interface OrderDetailsInterface {
    id: number,
    orderId: number,
    productId: number,
    quantity: number
}