import { CustomCursor } from './components/cursor/CustomCursor'
import { AppRouter } from './router/AppRouter'
import { useSoundAmbience } from './features/sound/useSoundAmbience'

function App() {
  useSoundAmbience()

  return (
    <div className="noise min-h-screen bg-forest-950 text-white font-body selection:bg-forest-500/30">
      <CustomCursor />
      <AppRouter />
    </div>
  )
}

export default App
