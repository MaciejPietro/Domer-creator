import useAuth from '@/Auth/hooks/useAuth';
import { LoadAction } from '@/Editor2d/editor/actions/LoadAction';
import { ResetAction } from '@/Editor2d/editor/actions/ResetAction';
import { SaveAction } from '@/Editor2d/editor/actions/SaveAction';
import { SaveInProjectAction } from '@/Editor2d/editor/actions/SaveInProjectAction';
import { ViewMode } from '@/Editor2d/editor/constants';
import { useStore } from '@/stores/EditorStore';
import { NavbarLink } from '@/ui/NavbarLink';
import { Menu, Group } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useRef } from 'react';
import { DeviceFloppy, Upload, Menu2, Rotate, BrandGithub, Heart, User, Logout, List } from 'tabler-icons-react';
import AuthMenuItems from '../nav/AuthMenuItems';
import GuestMenuItems from '../nav/GuestMenuItems';

const DropdownMenu = () => {
    const { isAuth } = useAuth();

    const navigate = useNavigate();
    const { setActiveMode } = useStore();
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
                        <Menu2 size={20} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
                    </button>
                </Menu.Target>

                <Menu.Dropdown className="ml-3">
                    {/* <Menu.Label>Projekt</Menu.Label> */}
                    <Menu.Item
                        leftSection={<DeviceFloppy size={16} />}
                        onClick={() => {
                            const action = new SaveInProjectAction();

                            action.execute();
                        }}
                    >
                        <span className="text-sm ">Zapisz w projekcie</span>
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<DeviceFloppy size={16} />}
                        onClick={() => {
                            const action = new SaveAction();

                            action.execute();
                        }}
                        rightSection={<span className="text-xs text-gray-300">.json</span>}
                    >
                        <span className="text-sm ">Zapisz</span>
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<Upload size={16} />}
                        onClick={() => fileRef.current?.click()}
                        rightSection={<span className="text-xs text-gray-300">.json</span>}
                    >
                        <span className="text-sm">Wczytaj</span>
                    </Menu.Item>

                    <Menu.Item
                        leftSection={<Rotate size={16} />}
                        onClick={() => {
                            setActiveMode(ViewMode.Edit);
                            const action = new ResetAction();

                            action.execute();
                        }}
                    >
                        <span className="text-sm">Zacznij od nowa</span>
                    </Menu.Item>

                    <Menu.Divider />

                    {isAuth ? <AuthMenuItems /> : <GuestMenuItems />}

                    {/* <Menu.Item
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
                    </Menu.Item> */}

                    <Menu.Divider />

                    <Menu.Label className="text-gray-300 font-normal text-[10px]">
                        Made with <Heart size={14} className="transform translate-y-1" color="#ffaabb" /> by{' '}
                        <a
                            href="https://github.com/MaciejPietro"
                            target="_blank"
                            className="text-blue-200 opacity-75 hover:opacity-100 transition-opacity inline-flex gap-1 items-center"
                        >
                            EmpeDev
                            <BrandGithub size={14} className="mt-0.5" />
                        </a>
                    </Menu.Label>
                </Menu.Dropdown>
            </Menu>
        </>
    );
};

export default DropdownMenu;
