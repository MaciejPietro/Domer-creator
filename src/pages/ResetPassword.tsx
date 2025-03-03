import ResetPasswordForm from '@/Auth/components/ResetPasswordForm';
import useMount from '@/Common/hooks/useMount';
import { modals } from '@mantine/modals';
import { useNavigate } from '@tanstack/react-router';
import Homepage from './Homepage';

const ResetPassword = () => {
    const navigate = useNavigate();

    useMount(() => {
        modals.closeAll();
        modals.open({
            children: <ResetPasswordForm />,
            onClose: () => {
                navigate({ to: '/' });
            },
            withCloseButton: false,
            closeOnClickOutside: false,
        });
    });

    return <Homepage />;
};

export default ResetPassword;
