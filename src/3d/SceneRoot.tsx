import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { FlyControls, KeyboardControls, OrbitControls, PivotControls } from '@react-three/drei';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';
import { Environment } from '@/3d/Enviroment';
import { DoubleSide } from 'three';
import { FloorPlan } from '@/2d/editor/objects/FloorPlan';
import { HomePlus } from 'tabler-icons-react';
import { Button } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/2d/editor/constants';
import House from './House';
import { calculateCenterPoint } from './utils/helpers';

export default function SceneRoot() {
    const plan = FloorPlan.Instance.getPlanForModel();

    const { setActiveMode } = useStore();

    const centerPoint = calculateCenterPoint(plan.wallNodes);

    return (
        <>
            {plan.wallNodes.length ? (
                <Canvas style={{ height: '100vh' }} shadows camera={{ position: [-60, 40, 15], fov: 25 }}>
                    <axesHelper args={[10]} />
                    <gridHelper args={[200, 200, 0xff0000, 'teal']} />
                    {/* @ts-expect-error find why */}
                    <House plan={plan} />
                    <Environment />
                    <OrbitControls makeDefault target={centerPoint} />
                </Canvas>
            ) : (
                <div className="w-full h-screen flex justify-center items-center gap-2 text-xl text-gray-800">
                    <HomePlus className="text-blue-500" />
                    Dodaj ściany w <Button onClick={() => setActiveMode(ViewMode.Edit)}>Tryb edycji</Button>
                </div>
            )}
        </>
    );
}
