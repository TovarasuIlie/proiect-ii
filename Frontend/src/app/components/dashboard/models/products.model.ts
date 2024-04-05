import { CategoryInterface } from "./category-interface";

export interface ProductsInterface {
    id: number | null;
    title: string | null;
    description: string | null;
    category: CategoryInterface | null;
    technicalDetailsJson: any| null;
    quantity: number | null;
    price: number | null;
}

export interface ProductAddInterface {
    title: string;
    description: string;
    category:CategoryInterface | null;
    technicalDetailsJson: string;
    quantity: number;
    price: number;
}
