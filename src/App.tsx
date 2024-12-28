import { useRef } from 'react'
import { Mesh } from 'three'
import type { DataTexture } from 'three'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import {
    Caustics,
    useGLTF,
    CubeCamera,
    Environment,
    OrbitControls,
    MeshRefractionMaterial,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RGBELoader } from 'three-stdlib'

import { easing } from 'maath'


import type { MeshProps } from '@react-three/fiber'

function Diamond(props: MeshProps) {
    const ref = useRef<Mesh>(null!)
    const { nodes } = useGLTF('/dflat.glb')
    // we know that the diamond is a mesh, so we can use this code
    // however, it is dangerous and a bad practice
    const diamond = nodes.Diamond_1_0 as Mesh
    console.log(nodes)
    // Use a custom envmap/scene-backdrop for the diamond material
    // This way we can have a clear BG while cube-cam can still film other objects
    const texture: DataTexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
    // Optional config
    const config = {
        "bounces": 3,
        "aberrationStrength": 0.01,
        "ior": 2.75,
        "fresnel": 1,
        "color": "grey"
    }

    return (
        <mesh castShadow ref={ref} geometry={diamond.geometry} {...props}>
            <MeshRefractionMaterial envMap={texture} {...config} toneMapped={false} />
        </mesh>
    )
}

function BuildEnvAndLight() {
    return (
        <>
            <color attach="background" args={['#000']} />
            <ambientLight intensity={0.5 * Math.PI} />
            <spotLight decay={0} position={[5, 5, -10]} angle={0.15} penumbra={1} />
            <pointLight decay={0} position={[-10, -10, -10]} />
            <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr" />
        </>
    );
}
export default function App() {
    return (
        <Canvas shadows camera={{ position: [-5, 0.5, 5], fov: 45 }}>
            <Diamond position={[0, -0.175 + 0.5, 0]} />
            <BuildEnvAndLight />
            <EffectComposer>
                <Bloom luminanceThreshold={1} intensity={2} levels={9} mipmapBlur />
            </EffectComposer>
            <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} minAzimuthAngle={-Math.PI / 2} maxAzimuthAngle={Math.PI / 2} />
        </Canvas>
    )
}
