import { Menu } from '@mantine/core';
import { Login, UserPlus } from 'tabler-icons-react';
import { useNavigate } from '@tanstack/react-router';
import { modals } from '@mantine/modals';
import LoginForm from '@/Auth/components/LoginForm';

const GuestMenuItems = () => {
    const navigate = useNavigate();

    return (
        <>
            <Menu.Item
                leftSection={<Login size={18} />}
                onClick={(e) => {
                    modals.closeAll();
                    modals.open({
                        children: <LoginForm />,
                    });
                }}
            >
                <span className="text-sm">Zaloguj się</span>
            </Menu.Item>
        </>
    );
};

export default GuestMenuItems;
