import create from "zustand";
import { getCategoriesRequest, getCategoryInfo } from "../api/api-client";

export interface Category {
    _id: string,
    name: string,
    visible: boolean
}

export interface FurnitureData {
    _id?: string,
    name?: string,
    width: number,
    height: number,
    imagePath: string,
    category?: string,
    zIndex?: number
}

export interface FurnitureStore {
    categories: Category[],
    currentFurnitureData: FurnitureData[]
    getCategories: () => void,
    getCurrentFurnitureData: (categoryId:string) => void
}

export const useFurnitureStore = create<FurnitureStore>(set => ({
    categories: [],
    currentFurnitureData: [],
    getCategories: async () => {
        // let res = await(await getCategoriesRequest()).json()
        //     set(() => ({
        //         categories: res
        //     }));
        set(() => ({
            categories: []
        }))
    },
    getCurrentFurnitureData: async (categoryId:string) => {
        // let res = await(await getCategoryInfo(categoryId)).json()
        // set(() => ({
        //     currentFurnitureData: res
        // }))
        set(() => ({
            currentFurnitureData: []
        }))

    }
}))