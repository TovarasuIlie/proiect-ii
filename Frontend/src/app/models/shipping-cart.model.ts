import { ProductsInterface } from "../components/dashboard/models/products.model";

export interface ShippingCartInterface {
    id: number;
    product: ProductsInterface;
    quantity: number;
    totalPrice: number;
}