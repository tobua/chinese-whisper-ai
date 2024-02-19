import { scale } from 'optica'
import {
  type CSSProperties,
  type ChangeEventHandler,
  type DragEventHandler,
  type JSX,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Button } from '../Button'
import { Close } from '../Icon'

const wrapperStyles = (selected: boolean): CSSProperties => ({
  display: 'flex',
  flex: 0,
  flexDirection: 'column',
  alignItems: 'center',
  gap: scale(20),
  position: 'relative',
  background: 'lightgray',
  padding: scale(40),
  borderRadius: scale(20),
  ...(selected && {
    padding: scale(20),
  }),
})

const dropStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: scale(20),
  textAlign: 'center',
  fontSize: scale(20),
}

const orTextStyles: CSSProperties = {
  fontSize: scale(14),
  color: 'gray',
}

const openFileStyles: CSSProperties = {
  border: 'none',
  cursor: 'pointer',
  background: 'black',
  color: 'white',
  padding: scale(10),
  borderRadius: scale(10),
}

const imageStyles: CSSProperties = {
  width: 'auto',
  maxHeight: scale(400),
  borderRadius: scale(10),
  background: 'white',
  border: '4px solid #ABABAB',
}

const clearStyles: CSSProperties = {
  position: 'absolute',
  top: scale(10),
  right: scale(10),
  background: 'none',
  border: 'none',
  cursor: 'pointer',
}

function fileToBase64(file: File) {
  return new Promise<string>((done) => {
    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      done(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

export function ImageInput({
  style,
  url,
  setData,
  ...props
}: JSX.IntrinsicElements['div'] & { url?: string; setData: (value: string) => void }) {
  const [selectedImage, setSelectedImage] = useState<File>()
  const [initialUrl, setInitialUrl] = useState(url)

  useEffect(() => {
    setInitialUrl(url)
  }, [url])

  const handleImageChange = useCallback(
    (async (event) => {
      if (!event.target.files) return

      const file = event.target.files[0]

      if (file) {
        setData(await fileToBase64(file))
        // const formData = new FormData()
        // formData.append('file', file)
        // // Format to send to the backend in parent component.
        // setData(formData)
        // You can perform additional checks here, e.g., file type, size, etc.
        setSelectedImage(file)
      }
    }) as ChangeEventHandler<HTMLInputElement>,
    [],
  )

  const handleDrop = useCallback(
    (async (event) => {
      event.preventDefault()

      const file = event.dataTransfer.files[0]

      if (file) {
        setData(await fileToBase64(file))
        // const formData = new FormData()
        // formData.append('file', file)
        // // Format to send to the backend in parent component.
        // setData(formData)
        // You can perform additional checks here, e.g., file type, size, etc.
        setSelectedImage(file)
      }
    }) as DragEventHandler<HTMLDivElement>,
    [],
  )

  const handleDragOver = useCallback(
    ((event) => {
      event.preventDefault()
    }) as DragEventHandler<HTMLDivElement>,
    [],
  )

  if (initialUrl) {
    return (
      <div {...props} style={{ ...wrapperStyles(true), ...style }}>
        <img style={imageStyles} src={url} alt="Generated result" />
        <button type="button" style={clearStyles} onClick={() => setInitialUrl(undefined)}>
          <Close />
        </button>
        <Button as="a" target="_blank" href={initialUrl} download="image.png">
          Download
        </Button>
      </div>
    )
  }

  if (selectedImage) {
    return (
      <div {...props} style={{ ...wrapperStyles(true), ...style }}>
        <img style={imageStyles} src={URL.createObjectURL(selectedImage)} alt="Currently uploaded preview" />
        <button type="button" style={clearStyles} onClick={() => setSelectedImage(undefined)}>
          <Close />
        </button>
      </div>
    )
  }

  return (
    <div {...props} style={{ ...wrapperStyles(false), ...style }}>
      <div onDrop={handleDrop} onDragOver={handleDragOver} style={dropStyles}>
        <span>Drag & drop an image here</span>
        <span style={orTextStyles}>or</span>
        <label style={openFileStyles}>
          <input style={{ display: 'none' }} type="file" accept="image/*" onChange={handleImageChange} />
          Select File
        </label>
      </div>
    </div>
  )
}
