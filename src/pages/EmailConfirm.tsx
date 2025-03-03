import EmailConfirmForm from '@/Auth/components/EmailConfirmForm';
import useMount from '@/Common/hooks/useMount';
import { modals } from '@mantine/modals';
import { useNavigate } from '@tanstack/react-router';
import Homepage from './Homepage';

const ResetPassword = () => {
    const navigate = useNavigate();

    useMount(() => {
        modals.closeAll();
        modals.open({
            children: <EmailConfirmForm />,
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
