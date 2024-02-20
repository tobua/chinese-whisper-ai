import { scale } from 'optica'
import { type CSSProperties, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { modeOrder } from './helper'
import { randomMode } from './helper'
import { Button } from './markup/Button'
import { OpenAI } from './markup/Icon'
import { Input } from './markup/Input'
import { PreviousMode } from './markup/PreviousMode'
import type { Mode } from './types'

document.body.style.display = 'flex'
document.body.style.justifyContent = 'center'
document.body.style.margin = '0'
document.body.style.padding = '5vmin'
document.body.style.minHeight = 'calc(100vh - 10vmin)'

const appStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  fontFamily: 'sans-serif',
  maxWidth: 800,
  justifyContent: 'space-between',
  gap: scale(20),
}

const headerStyles: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const headingStyles: CSSProperties = {
  fontSize: scale(36),
  margin: 0,
}

const contentStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  justifyContent: 'center',
  background: '#efefef',
  width: '100%',
  aspectRatio: 1, // Height equal to width.
  borderRadius: '50%',
  alignItems: 'center',
}

const footerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  columnGap: scale(20),
  fontSize: scale(28, 10),
}

const App = () => {
  const [mode, setMode] = useState<Mode>(randomMode())

  return (
    <div style={appStyles}>
      <header style={headerStyles}>
        <h1 style={headingStyles}>AI Chinese Whisper</h1>
        <Button type="button" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </header>
      <main style={contentStyles}>
        <h1>{mode}</h1>
        <PreviousMode mode={modeOrder[mode].previous} onClick={() => setMode(modeOrder[mode].previous)} />
        <Input mode={mode} setMode={setMode} />
      </main>
      <footer style={footerStyles}>
        <p>DALL·E 3 — Whisper</p>
        <OpenAI />
        <p>GPT-4 Vision — TTS</p>
      </footer>
    </div>
  )
}

createRoot(document.body).render(<App />)
