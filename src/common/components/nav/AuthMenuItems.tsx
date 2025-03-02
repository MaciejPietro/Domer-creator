import { Menu } from '@mantine/core';
import { User, Logout, List } from 'tabler-icons-react';
import { useNavigate } from '@tanstack/react-router';

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

            <Menu.Item leftSection={<User size={16} />} onClick={() => {}}>
                <span className="text-sm">Konto</span>
            </Menu.Item>

            <Menu.Item leftSection={<Logout size={16} />} onClick={() => {}}>
                <span className="text-sm">Wyloguj</span>
            </Menu.Item>
        </>
    );
};

export default AuthMenuItems;
