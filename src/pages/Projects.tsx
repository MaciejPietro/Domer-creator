import AppSidebar from '@/Common/components/app/AppSidebar';
import ProjectTile from '@/Projects/components/ProjectTile';

const Projects = () => {
    return (
        <>
            <AppSidebar />

            <div className="container mx-auto mt-24 ">
                <div className="max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <ProjectTile />
                    <ProjectTile />
                    <ProjectTile />
                    <ProjectTile />
                    <ProjectTile />
                </div>
            </div>
        </>
    );
};

export default Projects;
