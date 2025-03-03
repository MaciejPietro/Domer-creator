import { Menu } from '@mantine/core';
import { User, Logout, List } from 'tabler-icons-react';
import { useNavigate } from '@tanstack/react-router';
import AuthService from '@/Auth/api/Service';
import useLogout from '@/Auth/hooks/useLogout';
import { modals, useModals } from '@mantine/modals';
import LogoutModal from '@/Auth/components/LogoutModal';

const AuthMenuItems = () => {
    const navigate = useNavigate();
    return (
        <>
            <Menu.Item
                leftSection={<List size={16} />}
                onClick={() => {
                    navigate({ to: '/projects' });
                }}
            >
                <span className="text-sm">Projekty</span>
            </Menu.Item>

            <Menu.Item
                leftSection={<User size={16} />}
                onClick={() => {
                    navigate({ to: '/account' });
                }}
            >
                <span className="text-sm">Konto</span>
            </Menu.Item>

            <Menu.Item
                leftSection={<Logout size={16} className="text-red-400" />}
                onClick={() => {
                    modals.open({
                        children: <LogoutModal />,
                    });
                }}
            >
                <span className="text-sm text-red-400">Wyloguj się</span>
            </Menu.Item>
        </>
    );
};

export default AuthMenuItems;
