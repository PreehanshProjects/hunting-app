import { Howl } from 'howler'
import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'

const forestSound = new Howl({
  src: ['https://cdn.pixabay.com/audio/2022/03/10/audio_f5517e3f28.mp3'], // Placeholder forest ambient
  loop: true,
  volume: 0,
  html5: true,
})

export function useSoundAmbience() {
  const { soundEnabled } = useAppStore()

  useEffect(() => {
    if (soundEnabled) {
      forestSound.play()
      forestSound.fade(0, 0.3, 1500)
    } else {
      forestSound.fade(0.3, 0, 800)
      setTimeout(() => {
        if (!useAppStore.getState().soundEnabled) {
          forestSound.pause()
        }
      }, 800)
    }
  }, [soundEnabled])
}
