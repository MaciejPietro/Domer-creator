import { ReactNode } from 'react';
import AppSidebar from '../components/app/AppSidebar';

type ComponentProps = {
    children: ReactNode;
};

const Main = ({ children }: ComponentProps) => {
    return (
        <div className="container mx-auto mt-24 ">
            <AppSidebar />

            {children}
        </div>
    );
};

export default Main;
