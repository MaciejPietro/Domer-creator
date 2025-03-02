import type { AxiosError } from 'axios';
// import { toastSuccess } from '@/Common/lib/toast';
import useAuthStore from '@/Auth/authStore';
import AuthService from '@/Auth/api/Service';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

const useLogout = () => {
    const { setAuth, setUser } = useAuthStore();
    //
    const navigate = useNavigate();

    return useMutation<unknown, AxiosError<string, any>>({
        mutationKey: ['auth', 'logout'],
        mutationFn: () => AuthService.logout(),
        onSuccess: () => {
            // toastSuccess('Zostałeś wylogowany');
            //   setToken("");
            setAuth(false);
            setUser(null);
            navigate({ to: '/' });
        },
    });
};

export default useLogout;
