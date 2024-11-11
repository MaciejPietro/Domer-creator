/* eslint-disable */
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PivotControls } from '@react-three/drei';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';
import { Environment } from '@/3d/Enviroment';
import { DoubleSide } from 'three';
import { FloorPlan } from '@/2d/editor/objects/FloorPlan';
import { HomePlus } from 'tabler-icons-react';
import { Button } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/2d/editor/constants';
import House from './House';

const calculateCenterPoint = (wallNodes: any) => {
    let sumX = 0;
    let sumY = 0;
    const sumZ = 0; // Assuming Z is 0 since the walls are defined in 2D (X,Y)

    // Loop through each wall node
    wallNodes.forEach((node: any) => {
        // Calculate midpoint of each wall segment
        const midX = (node.a.x + node.b.x) / 2;
        const midY = (node.a.y + node.b.y) / 2;

        // Sum the midpoints
        sumX += midX;
        sumY += midY;
    });

    // Calculate average
    const avgX = sumX / wallNodes.length;
    const avgY = sumY / wallNodes.length;
    const avgZ = sumZ / wallNodes.length;

    // Return the center point as a THREE.Vector3
    // return new THREE.Vector3(avgX, avgY, avgZ);
    return new THREE.Vector3(avgX, 0, avgY);
};

export default function SceneRoot() {
    const plan = FloorPlan.Instance.getPlanForModel();

    const { setActiveMode } = useStore();

    // const data = {
    //     wallNodes: [
    //         { a: { x: 0, y: 0 }, b: { x: 0, y: 20 } }, // Left wall
    //         { a: { x: 0, y: 20 }, b: { x: 16, y: 20 } }, // Top wall (first part)
    //         { a: { x: 16, y: 20 }, b: { x: 16, y: 12 } }, // Interior wall (for garage/room)
    //         { a: { x: 16, y: 12 }, b: { x: 24, y: 12 } }, // Top wall (second part, extending for garage)
    //         { a: { x: 24, y: 12 }, b: { x: 24, y: 0 } }, // Right wall of garage/extension
    //         { a: { x: 24, y: 0 }, b: { x: 20, y: 0 } }, // Bottom wall (connecting garage to house)
    //         { a: { x: 20, y: 0 }, b: { x: 20, y: 8 } }, // Interior wall (right side of main house)
    //         { a: { x: 20, y: 8 }, b: { x: 4, y: 8 } }, // Middle wall (porch or living area)
    //         { a: { x: 4, y: 8 }, b: { x: 4, y: 0 } }, // Left interior wall
    //         { a: { x: 4, y: 0 }, b: { x: 0, y: 0 } }, // Bottom left wall (back to starting point)
    //     ],
    // };

    const centerPoint = calculateCenterPoint(plan.wallNodes);

    return (
        <>
            {plan.wallNodes.length ? (
                <Canvas style={{ height: '100vh' }} shadows camera={{ position: [-60, 40, 15], fov: 25 }}>
                    <axesHelper args={[10]} />
                    <gridHelper args={[200, 200, 0xff0000, 'teal']} />
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
