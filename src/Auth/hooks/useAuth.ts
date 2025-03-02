import useAuthStore from "@/Auth/authStore";
import { useEffect } from "react";

export type AuthState = {
  isAuth: boolean;
  isPending: boolean;
};

const useAuth = () => {
  const { isAuth, isPending, checkAuth } = useAuthStore();

  useEffect(() => {
    if (isPending) {
      void checkAuth();
    }
  }, [checkAuth, isPending]);

  return {
    isAuth,
    isPending,
  };
};

export default useAuth;
