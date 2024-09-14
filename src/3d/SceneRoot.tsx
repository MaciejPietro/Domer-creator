/* eslint-disable */
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PivotControls } from '@react-three/drei';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';
import { Environment } from '@/3d/Enviroment';
import { DoubleSide } from 'three';
import { FloorPlan } from '@/2d/editor/objects/FloorPlan';

const cyl = new THREE.CylinderGeometry(1, 1, 2, 20);
const tri = new THREE.CylinderGeometry(1, 1, 2, 3);

const WALL_WIDTH = 20;

const distance = (pointA: any, pointB: any) => {
    // const fillWallEdges = 0.5;
    const fillWallEdges = WALL_WIDTH / 100;

    return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)) + fillWallEdges;
};

const midpoint = (pointA: any, pointB: any) => ({
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
});

const angleBetweenPoints = (pointA: any, pointB: any) => Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);

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
    const plan = FloorPlan.Instance.getPlan();

    const data = {
        wallNodes: [
            { a: { x: 0, y: 0 }, b: { x: 0, y: 20 } }, // Left wall
            { a: { x: 0, y: 20 }, b: { x: 16, y: 20 } }, // Top wall (first part)
            { a: { x: 16, y: 20 }, b: { x: 16, y: 12 } }, // Interior wall (for garage/room)
            { a: { x: 16, y: 12 }, b: { x: 24, y: 12 } }, // Top wall (second part, extending for garage)
            { a: { x: 24, y: 12 }, b: { x: 24, y: 0 } }, // Right wall of garage/extension
            { a: { x: 24, y: 0 }, b: { x: 20, y: 0 } }, // Bottom wall (connecting garage to house)
            { a: { x: 20, y: 0 }, b: { x: 20, y: 8 } }, // Interior wall (right side of main house)
            { a: { x: 20, y: 8 }, b: { x: 4, y: 8 } }, // Middle wall (porch or living area)
            { a: { x: 4, y: 8 }, b: { x: 4, y: 0 } }, // Left interior wall
            { a: { x: 4, y: 0 }, b: { x: 0, y: 0 } }, // Bottom left wall (back to starting point)
        ],
    };

    const centerPoint = calculateCenterPoint(plan.wallNodes);

    return (
        <Canvas style={{ height: '100vh' }} shadows camera={{ position: [-60, 40, 15], fov: 25 }}>
            <axesHelper args={[10]} />
            <gridHelper args={[200, 200, 0xff0000, 'teal']} />
            <House plan={plan} />
            <Environment />
            <OrbitControls makeDefault target={centerPoint} />
        </Canvas>
    );
}

const doorBox = new THREE.BoxGeometry(2, 2, 2);

const Door = (props: any) => (
    <Subtraction {...props}>
        <Geometry>
            <Base geometry={doorBox} scale={[1, 2, 1]} />
            <Addition geometry={cyl} scale={0.5} rotation={[Math.PI / 2, 0, 0]} position={[0, 1, 0]} />
        </Geometry>
    </Subtraction>
);

const windowBox = new THREE.BoxGeometry(2, 2, 2);

const Window = (props: any) => (
    <Subtraction {...props}>
        <Geometry>
            <Base geometry={windowBox} />
            <Subtraction geometry={windowBox} scale={[0.05, 1, 1]} />
            <Subtraction geometry={windowBox} scale={[1, 0.05, 1]} />
        </Geometry>
    </Subtraction>
);

// const Chimney = (props: any) => (
//     <Addition name="chimney" {...props}>
//         <Geometry>
//             <Base name="base" geometry={box} scale={[1, 2, 1]} />
//             <Subtraction name="hole" geometry={box} scale={[0.7, 2, 0.7]} position={[0, 0.5, 0]} />
//         </Geometry>
//     </Addition>
// );

function House({ plan }: any) {
    const csg = useRef(null);

    if (!plan) return;

    return (
        // eslint-disable-next-line react/no-unknown-property
        <mesh>
            <meshStandardMaterial envMapIntensity={0.25} />

            <Geometry ref={csg} computeVertexNormals>
                <Base key={'xd'} geometry={new THREE.BoxGeometry(0, 0, 0)} />

                {plan.wallNodes.map(({ a, b }: any, id: number) => {
                    const dis = distance(a, b); // Length of the wall
                    const mid = midpoint(a, b); // Midpoint between a and b
                    const angle = angleBetweenPoints(a, b); // Angle to rotate the wall

                    // Create a box geometry for the wall with the calculated length
                    const wall = new THREE.BoxGeometry(dis, 2, WALL_WIDTH / 100);

                    return (
                        <group
                            key={`${id}-${a.x}-${a.y}-${b.x}-${b.y}`}
                            position={[mid.x, 1, mid.y]}
                            rotation={[0, -angle, 0]}
                        >
                            <Addition geometry={wall} />
                        </group>
                    );
                })}

                {/* <PivotControls
                    activeAxes={[false, true, true]}
                    rotation={[0, 0, 0]}
                    scale={1}
                    anchor={[-0.75, 0, 0]}
                    onDrag={() => csg.current?.update()}
                >
                    <Window position={[0.5, 3, 1.5]} scale={1} rotation={[Math.PI * 0.5, 0, 0]} />
                </PivotControls>

                <PivotControls
                    activeAxes={[false, true, true]}
                    rotation={[0, Math.PI * 0.5, 0]}
                    scale={1}
                    anchor={[-0.75, 0, 0]}
                    onDrag={() => csg.current?.update()}
                >
                    <Door position={[12, 2, 20]} scale={1} rotation={[0, 0, 0]} />
                </PivotControls> */}
            </Geometry>
        </mesh>
    );

    return (
        // eslint-disable-next-line react/no-unknown-property
        <mesh receiveShadow castShadow {...props}>
            <Geometry ref={csg} computeVertexNormals>
                <Base name="base" geometry={box} scale={[3, 3, 3]} />

                <Subtraction name="cavity" geometry={box} scale={[2.7, 3, 2.7]} />
                {/* <Addition
                    name="roof"
                    geometry={tri}
                    scale={[2.5, 1.5, 1.425]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 2.2, 0]}
                /> */}
                {/* <Subtraction
                                name="cavity"
                                geometry={new THREE.BoxGeometry(2, 2, 2)}
                                scale={[2.7, 3, 2.7]}
                            /> */}
                {/* <Chimney scale={0.5} position={[-0.75, 3, 0.8]} /> */}
                {/* <Window position={[1.1, 2.5, 0]} scale={0.6} rotation={[0, Math.PI / 2, 0]} />
                <Window position={[0, 2.5, 1.5]} scale={0.6} rotation={[0, 0, 0]} /> */}

                {/* <PivotControls
                                activeAxes={[false, true, true]}
                                rotation={[0, 0, 0]}
                                scale={1}
                                anchor={[0, 0, 0.4]}
                                onDrag={() => csg.current?.update()}
                            >
                                <Window position={[0.5, 1, 1.5]} scale={1.25} />
                            </PivotControls> */}

                {/* <PivotControls
                    activeAxes={[false, true, true]}
                    rotation={[0, Math.PI, 0]}
                    scale={1}
                    anchor={[0.4, 0, 0]}
                    onDrag={() => csg.current.update()}
                >
                    <Window rotation={[0, Math.PI / 2, 0]} position={[1.425, 0.25, 0]} scale={1.25} />
                </PivotControls> */}
                <PivotControls
                    activeAxes={[false, true, true]}
                    scale={1}
                    anchor={[-0.5, 0, 0]}
                    onDrag={() => (csg.current as any).update()}
                >
                    <Door rotation={[0, Math.PI / 2, 0]} position={[-1.425, -0.45, 0]} scale={[1, 0.9, 1]} />
                </PivotControls>
            </Geometry>
            <meshStandardMaterial envMapIntensity={0.25} />
        </mesh>
    );
}
