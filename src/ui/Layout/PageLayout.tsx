import { Center, Grid, Image, Modal } from '@mantine/core';
import { isMobile } from 'react-device-detect';
import { EditorRoot } from '../../editor/EditorRoot';
import { WelcomeModal } from '../WelcomeModal';
import ArcadaLogo from '../../res/logo.png';
import AppSidebar from '@/components/App/AppSidebar';
import AppNavbar from '@/components/App/AppNavbar';

export function PageLayout() {
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

            <EditorRoot />
        </>
    );
}
