import ResetPasswordForm from '@/Auth/components/ResetPasswordForm';
import useMount from '@/Common/hooks/useMount';
import EditorPage from '@/pages/EditorPage';
import { modals } from '@mantine/modals';
import { useNavigate } from '@tanstack/react-router';

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

    return <EditorPage />;
};

export default ResetPassword;
