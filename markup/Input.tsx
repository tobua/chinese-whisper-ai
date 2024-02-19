import { it } from 'avait'
import { scale } from 'optica'
import { type CSSProperties, type JSX, useCallback, useState } from 'react'
import { apiUrl } from '..'
import { modeOrder } from '../helper'
import { Mode } from '../types'
import { Button } from './Button'
import { Loader } from './Icon'
import { ImageInput } from './input/Image'
import { TextInput } from './input/Text'
import { VoiceInput } from './input/Voice'

const wrapperStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: scale(20),
}

const actionWrapperStyles: CSSProperties = {
  display: 'flex',
  gap: scale(10),
  justifyContent: 'center',
}

const loaderPositionStyles = (loading: boolean): CSSProperties => ({
  display: 'flex',
  flex: 1,
  position: 'absolute',
  top: '-3vmin',
  right: '-3vmin',
  left: '-3vmin',
  bottom: '-3vmin',
  opacity: 0.2,
  transition: 'opacity 900ms ease',
  pointerEvents: 'none',
  ...(loading && {
    opacity: 1,
  }),
})

const errorStyles: CSSProperties = {
  background: 'red',
  color: 'white',
  padding: scale(20),
  borderRadius: scale(10),
}

export function fileToBase64(file: Blob) {
  return new Promise<string>((done) => {
    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      done(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

export function Input({
  style,
  mode,
  setMode,
  ...props
}: JSX.IntrinsicElements['div'] & { mode: Mode; setMode: (mode: Mode) => void }) {
  const [data, setData] = useState<undefined | string>(undefined) // Text or base64.
  const [url, setUrl] = useState('') // Url
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const submitData = useCallback(
    async (output: Mode) => {
      setLoading(true)
      setError(false)
      const { error, value } = await it(
        fetch(apiUrl('transform'), {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'Input-Type': mode,
            'Output-Type': output,
          },
          body: data,
        }),
      )

      setLoading(false)

      if (error) {
        setError(true)
        return
      }

      setMode(output)

      if (output === Mode.Text) {
        const result = await value.text()
        setData(result)
        return
      }

      if (output === Mode.Image) {
        // Url to image in text response.
        const image = await value.text()
        setData(image)
        return
      }

      if (output === Mode.Voice) {
        const audioBlob = await value.blob()
        // const audioBlob = await streamToBlob(value.body, 'audio/mp3')
        // const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const base64Url = URL.createObjectURL(audioBlob)
        const base64Full = await fileToBase64(audioBlob)
        setData(base64Full)
        setUrl(base64Url)
        // console.log('middle', body)
        // setResult(voice)
        // setData(voice)
        // console.log('TODO voice output')
        return
      }

      setData(undefined)
    },
    [data, mode, setMode],
  )
  let input = <TextInput placeholder="Enter text..." data={data as string} setData={setData} />

  if (mode === Mode.Voice) {
    input = <VoiceInput data={data as string} url={url} setData={setData} setUrl={setUrl} />
  } else if (mode === Mode.Image) {
    input = <ImageInput url={data} setData={setData} />
  }

  return (
    <div {...props} style={{ ...wrapperStyles, ...style }}>
      <Loader style={loaderPositionStyles(loading)} rotate={loading} />
      {input}
      <div style={actionWrapperStyles}>
        <Button disabled={!data} onClick={() => submitData(modeOrder[mode].next)}>
          Convert to {modeOrder[mode].next}
        </Button>
      </div>
      {error && <p style={errorStyles}>⚠️ An error occurred, please try again later.</p>}
    </div>
  )
}
