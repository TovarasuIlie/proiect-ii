import { CategoryInterface } from "./category-interface";

export interface ProductsInterface {
    id: number;
    title: string | null;
    description: string | null;
    category: CategoryInterface | null;
    technicalDetailsJson: any | null;
    quantity: number;
    price: number | null;
    folderName: string;
    photoNumber: number;
}

export interface ProductAddInterface {
    title: string;
    description: string;
    category: CategoryInterface | null;
    technicalDetailsJson: string;
    quantity: number;
    price: number;
    partForCar: number[];
    image: File[]; 
}

export interface ProductEditInterface {
    id: number;
    title: string | null;
    description: string | null;
    category: CategoryInterface | null;
    technicalDetailsJson: any | null;
    quantity: number;
    price: number | null;
    folderName: string;
    photoNumber: number;
    partOfCar: number[];
}