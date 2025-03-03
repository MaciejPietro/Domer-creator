import useAuthStore from '@/Auth/authStore';

const useUser = () => {
    const { user } = useAuthStore();

    if (!user) {
        throw new Error('User should be defined here');
    }

    return user;
};

export default useUser;
