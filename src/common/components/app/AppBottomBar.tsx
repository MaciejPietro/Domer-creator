import { useStore } from '@/stores/EditorStore';
import { HelpDialog } from '@/ui/HelpDialog';

const AppBottomBar = () => {
    const { activeMode } = useStore();

    return (
        <div className="fixed bottom-4 right-4">
            <HelpDialog />
        </div>
    );
};

export default AppBottomBar;
