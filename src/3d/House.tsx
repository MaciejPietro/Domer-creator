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
import Door from './elements/Door/Door';

const tri = new THREE.CylinderGeometry(1, 1, 2, 3);

const distance = (pointA: any, pointB: any, wallWidth: number) => {
    // const fillWallEdges = 0.5;
    const fillWallEdges = wallWidth / 100;

    return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)) + fillWallEdges;
};

const midpoint = (pointA: any, pointB: any) => ({
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
});

const angleBetweenPoints = (pointA: any, pointB: any) => Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);

const House = ({ plan }: any) => {
    const csg = useRef(null);

    if (!plan) return;

    console.log(plan);

    return (
        <mesh>
            <meshStandardMaterial envMapIntensity={0.25} />

            <Geometry ref={csg} computeVertexNormals>
                <Base key={'xd'} geometry={new THREE.BoxGeometry(0, 0, 0)} />

                {plan.wallNodes.map(({ a, b, thickness }: any, id: number) => {
                    const dis = distance(a, b, thickness); // Length of the wall
                    const mid = midpoint(a, b); // Midpoint between a and b
                    const angle = angleBetweenPoints(a, b); // Angle to rotate the wall

                    // Create a box geometry for the wall with the calculated length
                    const wall = new THREE.BoxGeometry(dis, 2, thickness / 100);

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
                </PivotControls> */}

                <PivotControls
                    activeAxes={[false, true, true]}
                    rotation={[0, Math.PI * 0.5, 0]}
                    scale={1}
                    anchor={[-0.75, 0, 0]}
                    onDrag={() => csg.current?.update()}
                >
                    <Door position={[12, 2, 20]} scale={1} rotation={[0, 0, 0]} />
                </PivotControls>
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
};

export default House;
