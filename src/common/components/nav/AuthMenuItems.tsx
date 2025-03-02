import { Menu } from '@mantine/core';
import { User, Logout, List } from 'tabler-icons-react';
import { useNavigate } from '@tanstack/react-router';
import AuthService from '@/Auth/api/Service';
import useLogout from '@/Auth/hooks/useLogout';
const AuthMenuItems = () => {
    const navigate = useNavigate();
    const { mutateAsync } = useLogout();

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

            <Menu.Item leftSection={<User size={16} />} onClick={() => {}}>
                <span className="text-sm">Konto</span>
            </Menu.Item>

            <Menu.Item
                leftSection={<Logout size={16} className="text-red-400" />}
                onClick={() => {
                    mutateAsync();
                }}
            >
                <span className="text-sm text-red-400">Wyloguj się</span>
            </Menu.Item>
        </>
    );
};

export default AuthMenuItems;
