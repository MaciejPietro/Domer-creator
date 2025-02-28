import { DOOR_HEIGHT } from '@/2d/editor/objects/Furnitures/Door/constants';
import { cmToM } from '@/common/utils/transform';
import { Geometry, Base, Subtraction } from '@react-three/csg';
import { BoxGeometry, LoadingManager } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';

function DoorModel({ length, ...props }: any) {
    const textureSrc = '/assets/furnitures/door/Textures/Door.001.png';

    const materials = useLoader(MTLLoader, '/assets/furnitures/door/DoorOBJ.mtl', (loader) => {
        const loadingManager = new LoadingManager();
        loadingManager.setURLModifier((url) => {
            if (textureSrc) {
                return textureSrc;
            }
            return url;
        });
        loader.manager = loadingManager;
    });

    let object = useLoader(OBJLoader, '/assets/furnitures/door/DoorOBJ.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    // Calculate position offset based on the door dimensions
    // const xOffset = -cmToM(length) / 2;
    const xOffset = 0;
    const yOffset = -cmToM(DOOR_HEIGHT) / 2;

    return (
        <primitive
            object={object}
            scale={[0.11, 0.15, 0.12]}
            position={[xOffset, yOffset, 0]} // Center the model relative to the Subtraction
            {...props}
        />
    );
}

const Door = ({ length, position, rotation, ...props }: any) => {
    const doorBox = new BoxGeometry(cmToM(length), cmToM(DOOR_HEIGHT), 1);
    const [x, y, z] = position;

    return (
        <group position={[x, y, z]} rotation={rotation}>
            <Subtraction {...props}>
                <Geometry>
                    <Base geometry={doorBox} />
                </Geometry>
            </Subtraction>
            <DoorModel length={length} />
        </group>
    );
};

export default Door;
