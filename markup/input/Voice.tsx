import { scale } from 'optica'
import { type CSSProperties, type JSX, useEffect, useState } from 'react'
import { fileToBase64 } from '../../helper'
import { Button } from '../Button'
import { Close, Voice } from '../Icon'

const wrapperStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: scale(20),
  justifyContent: 'center',
  alignItems: 'center',
}

const recordStyles: CSSProperties = {
  display: 'flex',
  gap: scale(20),
  justifyContent: 'center',
}

const recordButtonStyles = (listening: boolean): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: scale(10),
  gap: scale(10),
  borderRadius: scale(20),
  outline: 'none',
  border: 'none',
  background: 'black',
  color: 'white',
  fontSize: scale(20),
  cursor: 'pointer',
  ...(listening && {
    background: 'red',
    color: 'black',
  }),
})

const transcriptStyles: CSSProperties = {
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
}

const clearStyles: CSSProperties = {
  position: 'absolute',
  top: scale(10),
  right: scale(10),
  background: 'none',
  border: 'none',
  cursor: 'pointer',
}

const previewWrapper: CSSProperties = {
  display: 'flex',
  position: 'relative',
  padding: scale(40),
  borderRadius: scale(20),
  background: 'lightgray',
}

export function VoiceInput({
  data = '',
  url = '',
  style,
  setData,
  setUrl,
  ...props
}: JSX.IntrinsicElements['div'] & {
  setData: (value: string) => void
  setUrl: (value: string) => void
  data: string
  url: string
}) {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)

  useEffect(() => {
    let mediaRecorder: MediaRecorder
    let audioChunks: Blob[] = []
    // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
    let recognition: SpeechRecognition

    const startListening = async () => {
      recognition = window.webkitSpeechRecognition
        ? new window.webkitSpeechRecognition()
        : new window.SpeechRecognition()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => {
        setListening(true)
      }

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]
        const text = result[0].transcript

        setTranscript(text)
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognition.start()

      mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const base64Url = URL.createObjectURL(audioBlob)
        const base64Full = await fileToBase64(audioBlob)
        setData(base64Full)
        setUrl(base64Url)
        audioChunks = []
      }

      mediaRecorder.start()
    }

    if (listening) {
      startListening()
    }

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop()
      }
      if (recognition) {
        recognition.stop()
      }
    }
  }, [listening, setData, setUrl])

  return (
    <div {...props} style={{ ...wrapperStyles, ...style }}>
      {data ? (
        <div style={previewWrapper}>
          {/* biome-ignore lint/a11y/useMediaCaption: no captions available */}
          <audio controls={true}>
            <source src={data} type={data.startsWith('data:audio/wav') ? 'audio/wav' : 'audio/mp3'} />
          </audio>
          <button type="button" style={clearStyles} onClick={() => setData('')}>
            <Close />
          </button>
        </div>
      ) : (
        <div style={recordStyles}>
          <textarea
            style={transcriptStyles}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Live transcript"
            rows={2}
          />
          <button type="button" style={recordButtonStyles(listening)} onClick={() => setListening(!listening)}>
            <Voice color={listening ? 'black' : 'white'} />
            {listening ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      )}
      {url && (
        <Button
          as="a"
          target="_blank"
          href={url}
          download={data.startsWith('data:audio/wav') ? 'audio.wav' : 'audio.mp3'}
        >
          Download
        </Button>
      )}
    </div>
  )
}
