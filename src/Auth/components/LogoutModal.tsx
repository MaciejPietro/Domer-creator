import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ArrowLeft, Logout } from 'tabler-icons-react';
import useLogout from '../hooks/useLogout';

const LogoutModal = () => {
    const { mutateAsync, isPending } = useLogout();

    const handleLogout = () => {
        void mutateAsync();
        modals.closeAll();
    };

    return (
        <div>
            <h2 className="px-6 text-center text-2xl font-bold">Wyloguj się</h2>

            <p className="text-gray-500 text-sm  mt-2 text-center">Jesteś pewny że chcesz opuścić aplikację?</p>

            <div className="mt-8 flex justify-between   ">
                <Button
                    size="md"
                    variant="subtle"
                    color="gray"
                    leftSection={<ArrowLeft size={16} />}
                    onClick={() => {
                        modals.closeAll();
                    }}
                >
                    Anuluj
                </Button>
                <Button
                    size="md"
                    color="red"
                    loading={isPending}
                    onClick={handleLogout}
                    rightSection={<Logout size={16} />}
                >
                    Wyloguj
                </Button>
            </div>
        </div>
    );
};

export default LogoutModal;
