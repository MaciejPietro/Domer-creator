import { create } from 'zustand';
import UserService from '@/User/api/Service';

export type User = {
    id: number;
    email: string;
    username: string;
    addresses: Array<{
        street: string;
        city: string;
        zip: string;
        countryCode: string;
    }>;
};

interface AuthState {
    user: User | null;
    isAuth: boolean;
    isPending: boolean;
    setAuth: (value: boolean) => void;
    setUser: (value: User | null) => void;
    checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuth: false,
    isPending: true,
    setAuth: (value: boolean) => {
        set(() => ({ isAuth: value }));
    },
    setUser: (value: User | null) => {
        set(() => ({ user: value }));
    },
    checkAuth: async () => {
        try {
            //   const response = await UserService.info();
            //   const { contact, user } = response.data;
            //   set(() => ({
            //     isAuth: true,
            //     isPending: false,
            //     user: {
            //       id: user.id,
            //       // id: contact.id,
            //       username: user.username,
            //       email: contact.mainEmail,
            //       addresses: contact.addresses,
            //     },
            //   }));
        } catch (error) {
            set(() => ({ isAuth: false, isPending: false }));
        }
    },
}));

export default useAuthStore;
