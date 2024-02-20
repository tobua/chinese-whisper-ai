import { Mode } from './types'

export const modeOrder: { [Key in Mode]: { previous: Mode; next: Mode } } = {
  [Mode.Text]: { previous: Mode.Voice, next: Mode.Image },
  [Mode.Image]: { previous: Mode.Text, next: Mode.Voice },
  [Mode.Voice]: { previous: Mode.Image, next: Mode.Text },
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

export const apiUrl = (path: string) =>
  `${process.env.NODE_ENV === 'production' ? '/api/' : 'http://localhost:3001/api/'}${path}`

export const randomMode = () => Object.values(Mode)[Math.floor(Math.random() * 3)]
