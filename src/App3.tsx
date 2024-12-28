import { Canvas } from "@react-three/fiber";
import {
    Text3D,
} from "@react-three/drei";
import { OrbitControls } from '@react-three/drei'

function Scene() {
    return (
        <Text3D
            curveSegments={32}
            bevelEnabled
            bevelSize={0.04}
            bevelThickness={0.01}
            height={0.5}
            lineHeight={0.5}
            letterSpacing={0.06}
            size={0.5}
            font="/Inter_Thin.json">
            {`Lorem ipsum dolor sit amet, consectetur adipiscing elit\n
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n
Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\n
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur\n
Excepteur sint occaecat cupid`}
            <meshNormalMaterial />
        </Text3D>
    )
}

export default function App() {
    return (
        <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 100 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} />
            <Scene />
            <OrbitControls />
        </Canvas>
    )
}

