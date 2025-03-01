import { EditorRoot } from '../../2d/EditorRoot';
import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/2d/editor/constants';
import SceneRoot from '@/3d/SceneRoot';
import AppNavbar from '@/common/components/AppNavbar';
import AppSidebar from '@/common/components/AppSidebar';

export function PageLayout() {
    const { activeMode } = useStore();

    return (
        <>
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
