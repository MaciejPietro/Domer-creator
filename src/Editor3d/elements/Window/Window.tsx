import { WindowType } from '@/Editor2d/editor/objects/Furnitures/Window/config';
import { cmToM } from '@/Common/utils/transform';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';
import { BoxGeometry } from 'three';

const windowBox = new BoxGeometry(2, 2, 2);

const Window = ({ height, length, bottom, type, ...props }: any) => {
    const windowBox = new BoxGeometry(cmToM(length), cmToM(height), 1);

    return (
        <Subtraction {...props}>
            <Geometry>
                <Base geometry={windowBox} />
                {type === WindowType.Casement ? <Subtraction geometry={windowBox} scale={[0.01, 1, 1]} /> : null}
                {/* <Subtraction geometry={windowBox} scale={[1, 0.05, 1]} /> */}
            </Geometry>
        </Subtraction>
    );
};

export default Window;
