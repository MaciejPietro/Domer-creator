import { Center, Grid, Image, Modal } from '@mantine/core';
import { isMobile } from 'react-device-detect';
import { EditorRoot } from '../../2d/EditorRoot';
import { WelcomeModal } from '../WelcomeModal';
import ArcadaLogo from '../../res/logo.png';
import AppSidebar from '@/components/App/AppSidebar';
import AppNavbar from '@/components/App/AppNavbar';
import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/2d/editor/constants';
import SceneRoot from '@/3d/SceneRoot';

export function PageLayout() {
    const { activeMode } = useStore();

    // if (isMobile) {
    //     return <>
    //         <Modal
    //             opened={true}
    //             withCloseButton={false}
    //             onClose={() => (false)}
    //         >
    //             <Center>
    //                 <Image src={ArcadaLogo}/>
    //             </Center>
    //         </Modal>
    //     </>
    // }

    return (
        <>
            {/* <WelcomeModal /> */}
            <AppNavbar></AppNavbar>

            <AppSidebar></AppSidebar>

            <div
                className={
                    activeMode === ViewMode.Edit || activeMode === ViewMode.View2d
                        ? ''
                        : 'absolute opacity-0 pointer-events-none'
                }
            >
                <EditorRoot />
            </div>

            {activeMode === ViewMode.View3d ? <SceneRoot /> : null}
        </>
    );
}
