import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';
import { BoxGeometry, CylinderGeometry } from 'three';

const doorBox = new BoxGeometry(2, 2, 2);

const cyl = new CylinderGeometry(1, 1, 2, 20);

const Door = (props: any) => (
    <Subtraction {...props}>
        <Geometry>
            <Base geometry={doorBox} scale={[1, 2, 1]} />
            <Addition geometry={cyl} scale={0.5} rotation={[Math.PI / 2, 0, 0]} position={[0, 1, 0]} />
        </Geometry>
    </Subtraction>
);

export default Door;
