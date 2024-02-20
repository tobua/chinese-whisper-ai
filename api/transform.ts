import { it } from 'avait'
import openAi, { toFile } from 'openai'

enum Mode {
  Text = 'Text',
  Image = 'Image',
  Voice = 'Voice',
}

export const runtime = 'edge'

const openai = new openAi({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
})

// biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
const isLocal = typeof Bun !== 'undefined'

// Loop: Voice (voiceToText) -> Text (textToImage) -> Image (imageToText) [-> Text (textToVoice)] -> Voice

async function textToImage(text: string) {
  // https://platform.openai.com/docs/guides/images/introduction
  const { error, data } = await it(
    openai.images.generate({
      model: 'dall-e-3',
      prompt: text,
      size: '1024x1024',
      quality: 'standard',
    }),
  )

  if (error) return new Response(error, { status: 500 })
  return data[0].url
}

async function voiceToText(voice: string) {
  // https://platform.openai.com/docs/guides/speech-to-text
  const audioBuffer = Buffer.from(voice.split('base64,')[1], 'base64')
  const file = await toFile(audioBuffer, 'audio.wav', { type: 'audio/wav' })
  const { error, value: transcript } = await it(
    openai.audio.transcriptions.create({
      model: 'whisper-1',
      file,
    }),
  )

  if (error) return new Response(error, { status: 500 })
  return transcript.text
}

// Internally used after image.
async function textToVoice(text: string) {
  // https://platform.openai.com/docs/guides/text-to-speech
  const { error, value } = await it(
    openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    }),
  )

  if (error || !value.body) return new Response(error as string, { status: 500 })
  return value // Response object with streamed mp3 data.
}

async function imageToText(image: string) {
  // https://platform.openai.com/docs/guides/vision
  const { error, choices } = await it(
    openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      // biome-ignore lint/style/useNamingConvention: <explanation>
      max_tokens: 300, // Increase length of the resulting description.
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: "What's in this image?" },
            {
              type: 'image_url',
              // biome-ignore lint/style/useNamingConvention: <explanation>
              image_url: {
                url: image,
                detail: 'high',
              },
            },
          ],
        },
      ],
    }),
  )

  if (error) return new Response(error, { status: 500 })
  return choices[0].message.content
}

// biome-ignore lint/style/useNamingConvention: <explanation>
export async function POST(request: Request) {
  // @ts-ignore
  const inputType = isLocal ? request.headers['input-type'] : (request.headers.get('input-type') as Mode)
  // @ts-ignore
  const outputType = isLocal ? request.headers['output-type'] : (request.headers.get('output-type') as Mode)
  const data = isLocal ? request.body : await new Response(request.body).text()

  if (inputType === Mode.Text && outputType === Mode.Image) {
    const url = await textToImage(data as string)
    return new Response(url as string)
  }

  if (inputType === Mode.Image && outputType === Mode.Voice) {
    const description = await imageToText(data as string)
    const voice = await textToVoice(description as string)
    return voice // Response object with mp3.
  }

  if (inputType === Mode.Voice && outputType === Mode.Text) {
    const text = await voiceToText(data as string)
    return new Response(text as string)
  }

  return new Response('Mode not found!', { status: 500 })
}
