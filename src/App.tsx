import React, { useRef } from 'react'
import { Mesh } from 'three'
import type { DataTexture } from 'three'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import {
    useGLTF,
    Environment,
    MeshRefractionMaterial,
    useScroll,
    ScrollControls,
    Html
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
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (offset * 20) - 20, 0.1)
        console.log(state.camera.position)
    })
    return <></>
}

function Logo(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/LinkedIn.glb')
    const linkedin = nodes.LinkedIn as Mesh
    const meshRef = useRef<Mesh>(null!)


    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.pointer.x / 20 * Math.PI;
            meshRef.current.rotation.x = state.pointer.y / 10 * Math.PI + Math.PI / 2;
        }
    })
    return (
        <>
            <group {...props} dispose={null}>
                <mesh ref={meshRef} geometry={linkedin.geometry}
                    position={[0, -9, 0]}
                    onClick={() => window.open('https://www.linkedin.com/in/aaron-z-shey')}
                    onPointerEnter={() => document.body.style.cursor = 'pointer'}
                    onPointerLeave={() => document.body.style.cursor = 'auto'}
                >
                    <meshNormalMaterial />
                </mesh>
            </group >
        </>
    )
}

export default function App() {
    return (
        <Canvas shadows camera={{ fov: 45, position: [0, 0, 5] }}>
            <ScrollControls>
                <MoveCameraOnScroll />

                <Diamond position={[0, 0, 0]} />
                <Html position={[-1, -1, 0]} as='div'>
                    I'm Aaron
                </Html>
                <Html position={[0, -1, 0]} as='div'>
                    I write websites and tutorials
                </Html>
                <Html position={[1, -1, 0]} as='div'>
                    I love electric vehicles and React.
                </Html>


                <Diamond position={[0, -5, 0]} />
                <Html position={[-1, -10, 0]} as='div'>
                    我是許智仁
                </Html>
                <Html position={[0, -10, 0]} as='div'>
                    我寫網站和教程
                </Html>
                <Html position={[1, -10, 0]} as='div'>
                    我喜歡在海浪邊散步
                </Html>

                <Logo />
                <BuildEnvAndLight />
                <EffectComposer>
                    <Bloom luminanceThreshold={1} intensity={2} levels={9} mipmapBlur />
                </EffectComposer>
            </ScrollControls>
        </Canvas >
    )
}
