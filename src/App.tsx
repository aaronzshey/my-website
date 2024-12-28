import { RGBELoader } from 'three-stdlib'
import { Canvas, useLoader } from '@react-three/fiber'
import {
    Environment,
    Lightformer,
    OrbitControls,
    RandomizedLight,
    AccumulativeShadows,
    MeshTransmissionMaterial,
    Float
} from '@react-three/drei'

import useSpline from '@splinetool/r3f-spline'


function Shape({ name, float = 300, color, ...props }) {
    const config = {
        "backside": false,
        "samples": 16,
        "resolution": 256,
        "transmission": 0.95,
        "roughness": 0.5,
        "clearcoat": 0.1,
        "clearcoatRoughness": 0.1,
        "thickness": 200,
        "backsideThickness": 200,
        "ior": 1.5,
        "chromaticAberration": 1,
        "anisotropy": 1,
        "distortion": 0,
        "distortionScale": 0.2,
        "temporalDistortion": 0,
        "attenuationDistance": 0.5,
        "attenuationColor": "#ffffff",
        "color": "#ffffff"
    }
    const { nodes } = useSpline('/shapes.splinecode')
    return (
        <Float floatIntensity={float} rotationIntensity={0} speed={2}>
            <mesh renderOrder={100} geometry={nodes[name].geometry} {...props}>
                <MeshTransmissionMaterial {...config} color={color} toneMapped={false} />
            </mesh>
        </Float>
    )
}

export default function App() {
    const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

    return (
        <Canvas shadows orthographic camera={{ position: [10, 20, 20], zoom: 80 }} gl={{ preserveDrawingBuffer: true }}>
            <color attach="background" args={['#f2f2f5']} />
            {/** The shape */}
            <mesh>
                <boxGeometry args={[5, 5, 1]} />
            </mesh>
            {/** Controls */}
            <OrbitControls
                autoRotateSpeed={-0.1}
                zoomSpeed={0.25}
                minZoom={40}
                maxZoom={140}
                dampingFactor={0.05}
            />

            <Shape name="Rectangle 6" color="#FF718F" position={[-700.64, 343.77, -621.72]} />
            <Shape name="Rectangle 5" color="#29C1A2" position={[-458.87, 411.05, -435.92]} />
            <Shape name="Rectangle 4" color="#FF9060" position={[0.66, 47, -435.92]} />
            <Shape name="Rectangle 3" color="#823FFF" position={[-348.74, -162.23, -167.36]} />
            <Shape name="Rectangle 2" color="skyblue" position={[242.6, 207, -273.39]} />

            {/** The environment is just a bunch of shapes emitting light. This is needed for the clear-coat */}
            <Environment resolution={256}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                    <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                    {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
                        <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
                    ))}
                    <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
                    <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
                    <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
                </group>
            </Environment>
            {/** Soft shadows */}
            <AccumulativeShadows frames={100} color={"white"} colorBlend={5} toneMapped={true} alphaTest={0.9} opacity={1} scale={30} position={[0, -1.01, 0]}>
                <RandomizedLight amount={4} radius={10} ambient={0.5} intensity={1} position={[0, 10, -10]} size={15} mapSize={1024} bias={0.0001} />
            </AccumulativeShadows>
        </Canvas>
    )
}