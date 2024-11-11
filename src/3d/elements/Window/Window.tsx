import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';
import { BoxGeometry } from 'three';

const windowBox = new BoxGeometry(2, 2, 2);

const Window = (props: any) => (
    <Subtraction {...props}>
        <Geometry>
            <Base geometry={windowBox} />
            <Subtraction geometry={windowBox} scale={[0.05, 1, 1]} />
            <Subtraction geometry={windowBox} scale={[1, 0.05, 1]} />
        </Geometry>
    </Subtraction>
);
