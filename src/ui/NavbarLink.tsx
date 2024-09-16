import { Icon as TablerIcon } from 'tabler-icons-react';
import { Menu, Tooltip, UnstyledButton } from '@mantine/core';

interface NavbarLinkProps {
    icon: TablerIcon;
    label?: string;
    active?: boolean;
    onClick?(): void;
    options?: any;
    position?: 'right' | 'left';
}

export function NavbarLink({ icon: Icon, label, active, onClick, options, position = 'right' }: NavbarLinkProps) {
    const Btn = () => (
        <div
            onClick={onClick}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                active
                    ? 'bg-blue-100  text-blue-500 dark:text-primary-400'
                    : 'text-gray-600 dark:text-dark-0 hover:bg-gray-100'
            }`}
        >
            <Icon />
        </div>
    );

    return options ? (
        <Menu position={position} trigger="hover">
            <Menu.Target>
                <UnstyledButton>
                    <Btn />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                {options.map((opt: any) => (
                    <Menu.Item
                        key={opt.title}
                        leftSection={opt.icon}
                        onClick={opt.onClick}
                        disabled={opt.disabled}
                        className={opt.active ? 'text-blue-500' : ''}
                    >
                        {opt.title}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    ) : (
        <Tooltip label={label} position={position} withArrow>
            <UnstyledButton>
                <Btn />
            </UnstyledButton>
        </Tooltip>
    );
}
