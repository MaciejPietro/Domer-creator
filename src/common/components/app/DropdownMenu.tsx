import useAuth from '@/Auth/hooks/useAuth';
import { LoadAction } from '@/Editor2d/editor/actions/LoadAction';

import { Menu } from '@mantine/core';
import { IconBrandGithub, IconHeart, IconLibraryPlus, IconMenu2, IconUpload } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useRef } from 'react';
import AuthMenuItems from '../nav/AuthMenuItems';
import GuestMenuItems from '../nav/GuestMenuItems';
import ProjectMenu from './ProjectMenu';

const DropdownMenu = () => {
    const { isAuth } = useAuth();

    const navigate = useNavigate();
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleChange = async (e: any) => {
        const resultText = await e.target.files.item(0).text();

        const action = new LoadAction(resultText);

        action.execute();
    };

    return (
        <>
            <input ref={fileRef} onChange={handleChange} multiple={false} type="file" accept=".json" hidden />

            <Menu shadow="md" radius="md" offset={10}>
                <Menu.Target>
                    <button className="group flex items-center bg-blue-50 size-10 shadow-md rounded-md justify-center border-none cursor-pointer">
                        <IconMenu2 size={20} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
                    </button>
                </Menu.Target>

                <Menu.Dropdown className="ml-3">
                    {/* <Menu.Label>Projekt</Menu.Label> */}
                    <Menu.Item
                        leftSection={<IconLibraryPlus size={16} />}
                        onClick={() => {
                            navigate({ to: '/' });
                        }}
                    >
                        <span className="text-sm ">Nowy projekt</span>
                    </Menu.Item>

                    <Menu.Item
                        leftSection={<IconUpload size={16} />}
                        onClick={() => fileRef.current?.click()}
                        rightSection={<span className="text-xs text-gray-300">.json</span>}
                    >
                        <span className="text-sm">Wczytaj</span>
                    </Menu.Item>

                    <ProjectMenu />

                    <Menu.Divider />

                    {isAuth ? <AuthMenuItems /> : <GuestMenuItems />}

                    <Menu.Divider />

                    <Menu.Label className="text-gray-300 font-normal text-[10px]">
                        Made with <IconHeart size={14} className="transform translate-y-1" color="#ffaabb" /> by{' '}
                        <a
                            href="https://github.com/MaciejPietro"
                            target="_blank"
                            className="text-blue-200 opacity-75 hover:opacity-100 transition-opacity inline-flex gap-1 items-center"
                        >
                            EmpeDev
                            <IconBrandGithub size={14} className="mt-0.5" />
                        </a>
                    </Menu.Label>
                </Menu.Dropdown>
            </Menu>
        </>
    );
};

export default DropdownMenu;
