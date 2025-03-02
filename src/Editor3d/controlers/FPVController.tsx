import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

const SPEED = 5;
const velocity = new THREE.Vector3();
const forwardDirectionVector = new THREE.Vector3();
const sidewaysDirectionVector = new THREE.Vector3();

export default function FPScontrols() {
    const [subscribeToKeys, getKeys] = useKeyboardControls();
    const rigidBodyRef = useRef<any>(null);
    const { camera } = useThree();

    useFrame((state, delta) => {
        //get input key values on every frame
        const { forwardKeyPressed, rightKeyPressed, backwardKeyPressed, leftKeyPressed } = getKeys();

        //check if ref has been linked to rigid body
        if (rigidBodyRef.current) {
            //get current position of rigid body (on every frame)
            const pos = rigidBodyRef.current.translation();

            //copy rigid body position to camera (on every frame)
            camera.position.copy(pos);

            //'front direction' takes true/false values from keyboard input
            //  and treats them as 1/0. When summed together you get a number
            //  on the z-axis telling you if you're going forward or backward.
            //Forward is in the -z direction
            forwardDirectionVector.set(0, 0, -forwardKeyPressed + backwardKeyPressed);

            //same for x, left is in the -x direction
            sidewaysDirectionVector.set(rightKeyPressed - leftKeyPressed, 0, 0);

            /**
             * VELOCITY SETUP
             */

            //combine forward & side directions into one vector
            //  (just for concise writing).Its the same same as
            //  doing { x: sideDir.x, y:0, z: forwardDir.z}
            velocity.addVectors(forwardDirectionVector, sidewaysDirectionVector);

            //force the combined vector to a magnitude of 1
            velocity.normalize();

            //give the combined vector a desired magnitude
            //i.e multiply direction by speed to get velocity
            velocity.multiplyScalar(SPEED);

            //account for different frame rates per user
            //'20' here is an arbitrary tuning value though
            velocity.multiplyScalar(delta * 20);

            //account for the pointerLock direction with some 'math'
            //  so that left,right etc are all relative to camera direction
            velocity.applyEuler(camera.rotation);
            //applying camera rotation to velocity can also be done with
            // velocity.applyQuaternion(camera.quaternion);

            //set the velicity of your capsule collider to the result velocity above
            rigidBodyRef.current.setLinvel({
                x: velocity.x,
                y: velocity.y * 0, //zero this if you don't have 'jump' functionality
                z: velocity.z,
            });
        }
    });

    return (
        <RigidBody
            ref={rigidBodyRef}
            colliders={false}
            mass={1}
            friction={0}
            restitution={0}
            position={[0, 1.2, 0]}
            enabledRotations={[false, false, false]}
        >
            <CapsuleCollider args={[0.6, 0.5]} />
        </RigidBody>
    );
}

export const World = () => {
    return (
        <>
            <RigidBody type="fixed" friction={0} restitution={0}>
                {/* ******Cube Obstacles */}
                {/* {[...new Array(10)].map((item, index) => {
                    return (
                        <mesh key={index} position={[(Math.random() - 0.5) * 20, 0.5, (Math.random() - 0.5) * 20]}>
                            <boxGeometry />
                            <meshStandardMaterial color="#da8a22" />
                        </mesh>
                    );
                })} */}
                {/**Floor */}
                <mesh>
                    <boxGeometry args={[20, 0.1, 20]} />
                    <meshStandardMaterial color="#5d9955" />
                </mesh>
                {/*************** */}
                {/**Walls */}
                {/* <mesh position={[10, 0.5, 0]}>
                    <boxGeometry args={[0.1, 1, 20]} />
                    <meshStandardMaterial color="#8899aa" />
                </mesh>
                <mesh position={[-10, 0.5, 0]}>
                    <boxGeometry args={[0.1, 1, 20]} />
                    <meshStandardMaterial color="#8899aa" />
                </mesh>
                <mesh position={[0, 0.5, 10]}>
                    <boxGeometry args={[20, 1, 0.1]} />
                    <meshStandardMaterial color="#8899aa" />
                </mesh>
                <mesh position={[0, 0.5, -10]}>
                    <boxGeometry args={[20, 1, 0.1]} />
                    <meshStandardMaterial color="#8899aa" />
                </mesh> */}
                {/*************** */}
            </RigidBody>
        </>
    );
};
