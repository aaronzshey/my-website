import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={0.5} />
      <ScrollControls pages={3}>
        <Cube />

        <mesh position={[0, 10, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color="orange" />
        </mesh>
      </ScrollControls>
    </Canvas>
  )
}

function Cube() {
  const scroll = useScroll()
  useFrame((state) => {
    const offset = 1 - scroll.offset
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, offset * 10, 0.1)
  })

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}