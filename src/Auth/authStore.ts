import { create } from 'zustand';
import UserService from '@/User/api/Service';
import { User } from '@/User/types';

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
            const response = await UserService.info();

            set(() => ({ isAuth: true, isPending: false, user: response.data }));
        } catch (error) {
            set(() => ({ isAuth: false, isPending: false }));
        }
    },
}));

export default useAuthStore;
