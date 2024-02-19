import { Mode } from './types'

export const modeOrder: { [Key in Mode]: { previous: Mode; next: Mode } } = {
  [Mode.Text]: { previous: Mode.Voice, next: Mode.Image },
  [Mode.Image]: { previous: Mode.Text, next: Mode.Voice },
  [Mode.Voice]: { previous: Mode.Image, next: Mode.Text },
}
