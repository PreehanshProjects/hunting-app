import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

function DeerModel() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={group}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1, 3]} />
        <meshStandardMaterial color="#8b5e2a" roughness={0.8} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.2, 1.5]}>
        <boxGeometry args={[0.8, 0.8, 1]} />
        <meshStandardMaterial color="#8b5e2a" roughness={0.8} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.6, 1.2]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#8b5e2a" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh position={[0.5, -1, 1.2]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#5e3e1c" />
      </mesh>
      <mesh position={[-0.5, -1, 1.2]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#5e3e1c" />
      </mesh>
      <mesh position={[0.5, -1, -1.2]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#5e3e1c" />
      </mesh>
      <mesh position={[-0.5, -1, -1.2]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#5e3e1c" />
      </mesh>

      {/* Antlers (Stylized) */}
      <mesh position={[0.3, 2, 1.5]} rotation={[0, 0.2, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5]} />
        <meshStandardMaterial color="#d4c3a3" />
      </mesh>
      <mesh position={[-0.3, 2, 1.5]} rotation={[0, -0.2, -0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5]} />
        <meshStandardMaterial color="#d4c3a3" />
      </mesh>
    </group>
  )
}

export function DeerScene() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [5, 5, 5], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#f5a623" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#3a7a30" />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <DeerModel />
          </Float>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0a1208" transparent opacity={0.5} />
          </mesh>

          <Environment preset="forest" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          <fog attach="fog" args={['#0a1208', 5, 20]} />
        </Suspense>
      </Canvas>
    </div>
  )
}
