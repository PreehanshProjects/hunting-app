import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export function ForestParticles() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 pointer-events-none z-0"
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 120,
        particles: {
          number: { value: 60, density: { enable: true } },
          color: { value: ['#3a7a30', '#2a5522', '#f5a623'] },
          opacity: {
            value: { min: 0.1, max: 0.4 },
            animation: { enable: true, speed: 0.5, sync: false }
          },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'top',
            random: true,
            straight: false,
            outModes: { default: 'out' },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' },
          },
          modes: { repulse: { distance: 80, duration: 0.4 } }
        },
        detectRetina: true,
      }}
    />
  )
}
