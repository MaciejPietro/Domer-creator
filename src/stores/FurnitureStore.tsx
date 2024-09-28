import { create } from 'zustand';

export interface Category {
    _id: string;
    name: string;
    visible: boolean;
}

export interface FurnitureData {
    _id?: string;
    name?: string;
    width: number;
    height: number;
    imagePath: string;
    category?: string;
    zIndex?: number;
}

export interface FurnitureStore {
    categories: Category[];
    currentFurnitureData: FurnitureData[];
    getCategories: () => void;
    getCurrentFurnitureData: (categoryId: string) => void;
}

export const useFurnitureStore = create<FurnitureStore>((set) => ({
    categories: [],
    currentFurnitureData: [],
    getCategories: async () => {
        set(() => ({
            categories: [],
        }));
    },
    getCurrentFurnitureData: async () => {
        set(() => ({
            currentFurnitureData: [],
        }));
    },
}));
