import { EditorRoot } from '@/2d/EditorRoot';
import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/2d/editor/constants';
import SceneRoot from '@/3d/SceneRoot';
import AppSidebar from '@/common/components/AppSidebar';
import EditorToolbar from '@/2d/components/Toolbar/EditorToolbar';
import AppBottomBar from '@/common/components/AppBottomBar';

export default function EditorPage() {
    const { activeMode } = useStore();

    return (
        <>
            <EditorToolbar />

            <AppSidebar></AppSidebar>

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
