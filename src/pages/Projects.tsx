import AppSidebar from '@/Common/components/app/AppSidebar';
import ProjectTile from '@/Projects/components/ProjectTile';
import Main from '@/Common/layouts/Main';

const Projects = () => {
    return (
        <Main>
            <div className="max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <ProjectTile />
                <ProjectTile />
                <ProjectTile />
                <ProjectTile />
                <ProjectTile />
            </div>
        </Main>
    );
};

export default Projects;
