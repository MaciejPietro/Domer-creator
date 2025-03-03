import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/Editor2d/editor/constants';
import SceneRoot from '@/Editor3d/SceneRoot';
import EditorToolbar from '@/Editor2d/components/Toolbar/EditorToolbar';
import AppBottomBar from '@/Common/components/app/AppBottomBar';
import AppSidebar from '@/Common/components/app/AppSidebar';
import EditorRoot from '@/Editor2d/EditorRoot';

export default function Homepage() {
    const { activeMode } = useStore();

    return (
        <>
            <EditorToolbar />

            <AppSidebar />

            <AppBottomBar />

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
