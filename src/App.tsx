import { useRef } from 'react'
import { Mesh } from 'three'
import type { DataTexture } from 'three'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import {
    useGLTF,
    Environment,
    MeshRefractionMaterial,
    useScroll,
    ScrollControls,
    Text3D,
    MeshDistortMaterial
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RGBELoader } from 'three-stdlib'

import type { MeshProps } from '@react-three/fiber'
import * as THREE from 'three'

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



function MoveCameraOnScroll() {
    const scroll = useScroll()
    useFrame((state) => {
        const offset = 1 - scroll.offset
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (offset * 10) - 10, 0.1)
        console.log(state.camera.position)
        //state.camera.lookAt(0, 0, 0)
    })
    return <></>
}

function AboutMe() {
    return (
        <Text3D
            curveSegments={32}
            bevelEnabled
            bevelSize={0.04}
            bevelThickness={0.01}
            height={0.1}
            lineHeight={0.5}
            letterSpacing={0.06}
            size={0.6}
            position={[-6, 3, -1]}
            rotation={[-Math.PI / 2, 0, 0]}
            font="/Inter_Thin.json">

            {`Scroll down`}

            <MeshDistortMaterial
                distort={0.01}
                transmission={0}
                thickness={-0.5}
                roughness={0}
                iridescence={1}
                iridescenceIOR={1}
                iridescenceThicknessRange={[0, 1200]}
                clearcoat={1}
                clearcoatRoughness={0}
                envMapIntensity={1.5}
                color={"white"}
            />
        </Text3D>
    )
}

function RealAboutMe() {
    return (
        <Text3D
            curveSegments={32}

            height={0.1}
            lineHeight={1}
            letterSpacing={0.01}
            size={0.1}
            position={[-1, -0.6, 0]}
            rotation={[0, 0, 0]}
            font="/Inter_Thin.json">

            {`I'm Aaron Shey\n
            I write websites and tutorials for fun.\n
            Click on the bubbles to learn more.\n
            `}

            <meshNormalMaterial />

        </Text3D>
    )
}

export default function App() {
    return (
        <Canvas shadows camera={{ fov: 45, position: [0, 0, 5] }}>
            <ScrollControls>
                <MoveCameraOnScroll />
                <Diamond />
                <AboutMe />
                <RealAboutMe />
                <BuildEnvAndLight />
                <EffectComposer>
                    <Bloom luminanceThreshold={1} intensity={2} levels={9} mipmapBlur />
                </EffectComposer>
            </ScrollControls>
        </Canvas >
    )
}
