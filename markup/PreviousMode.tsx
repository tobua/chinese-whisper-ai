import { scale } from 'optica'
import type { CSSProperties } from 'react'
import type { Mode } from '../types'

const wrapperStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: scale(10),
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
}

const buttonStyles: CSSProperties = {
  width: scale(80),
  height: scale(80),
  borderRadius: '50%',
  outline: 'none',
  cursor: 'pointer',
  border: 'none',
  background: 'gray',
  fontSize: scale(20),
  color: 'white',
}

export function PreviousMode({ mode, onClick }: { mode: Mode; onClick: () => void }) {
  return (
    <div style={wrapperStyles}>
      <button style={buttonStyles} type="button" onClick={onClick}>
        {mode}
      </button>
    </div>
  )
}
