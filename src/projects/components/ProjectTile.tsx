import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

const ProjectTile = () => {
    return (
        <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
            <Image
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                alt="Norway"
                className="object-cover h-full w-full"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent h-40 flex items-end">
                <Text fw={500}>Norway Fjord Adventures</Text>
            </div>
        </div>
    );
};

export default ProjectTile;
