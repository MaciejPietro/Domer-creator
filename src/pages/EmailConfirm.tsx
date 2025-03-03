import EmailConfirmForm from '@/Auth/components/EmailConfirmForm';
import ResetPasswordForm from '@/Auth/components/ResetPasswordForm';
import useMount from '@/Common/hooks/useMount';
import EditorPage from '@/pages/EditorPage';
import { ResetPasswordSearchParams } from '@/routes/auth/resetpassword';
import { Modal } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';

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

    return (
        <>
            <EditorPage />
        </>
    );
};

export default ResetPassword;
