import { scale } from 'optica'
import type { CSSProperties, JSX } from 'react'
import { Button } from '../Button'

function textDownload(content: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  return URL.createObjectURL(blob)
}

const wrapperStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: scale(20),
  alignItems: 'center',
}

const inputStyles: CSSProperties = {
  display: 'flex',
  gap: scale(20),
  background: 'lightgray',
  outline: 'none',
  borderWidth: 0,
  borderRadius: scale(20),
  padding: scale(20),
  fontFamily: 'sans-serif',
  fontSize: scale(20),
  resize: 'none',
  lineHeight: 1.4,
  minWidth: '50%',
}

export function TextInput({
  style,
  data = '',
  setData,
  minimumRows = 4,
  ...props
}: JSX.IntrinsicElements['textarea'] & { data: string; setData: (value: string) => void; minimumRows?: number }) {
  const rowCount = Math.min(Math.max(minimumRows + 1, (data.match(/\n/g) || []).length + 2), 20)
  return (
    <div style={wrapperStyles}>
      <textarea
        value={data}
        onChange={(event) => setData(event.target.value)}
        rows={rowCount}
        cols={40}
        {...props}
        style={{ ...inputStyles, ...style }}
      />
      {data.length > 5 && (
        <Button as="a" target="_blank" href={textDownload(data)} download="text.txt">
          Download
        </Button>
      )}
    </div>
  )
}
