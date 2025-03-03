import LoginForm from '@/Auth/components/LoginForm';
import useMount from '@/Common/hooks/useMount';
import { EmailConfirmSearchParams } from '@/routes/auth/emailconfirm';
import { Button, Loader } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useSearch } from '@tanstack/react-router';
import clsx from 'clsx';
import { useEffect } from 'react';
import { ArrowLeft, CircleCheck } from 'tabler-icons-react';
import useConfirmEmail from '../hooks/useConfirmEmail';

const EmailConfirmForm = () => {
    // @ts-expect-error fix me
    const search: Required<EmailConfirmSearchParams> = useSearch({
        strict: true,
    });

    const { mutate, isPending, isSuccess, isError } = useConfirmEmail();

    useEffect(() => {
        if (search.token && search.email) {
            void mutate({ token: search.token, email: search.email });
        }
    }, []);

    if (isError) {
        return (
            <div>
                <p>Email nie został potwierdzony.</p>
            </div>
        );
    }

    console.log('xdxd', { isPending, isError, isSuccess });

    return (
        <div className="relative">
            {isPending ? (
                <div className="w-full flex flex-col gap-4 justify-center items-center h-full absolute top-0 left-1/2 -translate-x-1/2">
                    <Loader size={40} color="blue" />
                    <div className="text-center">Trwa potwierdzanie adresu e-mail...</div>
                </div>
            ) : null}
            <div className={clsx(isPending && 'opacity-0 pointer-events-none')}>
                <div className="flex flex-col items-center gap-2 pb-6">
                    <CircleCheck size={100} className="text-blue-600" />
                    <h1 className="text-2xl font-bold mb-0">Email został potwierdzony!</h1>
                    <p className="text-center mb-6 block">Możesz się teraz zalogować.</p>

                    <Button
                        onClick={() => {
                            modals.closeAll();
                        }}
                        size="md"
                        leftSection={<ArrowLeft size={16} />}
                    >
                        Zaloguj się
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmForm;
