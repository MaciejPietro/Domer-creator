import { LoadAction } from '@/2d/editor/actions/LoadAction';
import { ResetAction } from '@/2d/editor/actions/ResetAction';
import { SaveAction } from '@/2d/editor/actions/SaveAction';
import { NavbarLink } from '@/ui/NavbarLink';
import { Menu, Group } from '@mantine/core';
import { useRef } from 'react';
import { DeviceFloppy, Upload, Menu2, Rotate, BrandGithub, Heart } from 'tabler-icons-react';

const DropdownMenu = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleChange = async (e: any) => {
        const resultText = await e.target.files.item(0).text();

        const action = new LoadAction(resultText);

        action.execute();
    };

    return (
        <>
            <input ref={fileRef} onChange={handleChange} multiple={false} type="file" accept=".json" hidden />

            <Menu shadow="md">
                <Menu.Target>
                    <button className="flex items-center justify-center border-none cursor-pointer bg-transparent -mt-0.5">
                        <Menu2 size={24} />
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Projekt</Menu.Label>
                    <Menu.Item
                        leftSection={<DeviceFloppy size={16} />}
                        onClick={() => {
                            const action = new SaveAction();

                            action.execute();
                        }}
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

                    <Menu.Divider />

                    <Menu.Item
                        leftSection={<Rotate size={16} />}
                        onClick={() => {
                            const action = new ResetAction();

                            action.execute();
                        }}
                    >
                        <span className="text-sm">Zacznij od nowa</span>
                    </Menu.Item>

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
