<p align="center">
  <img src="https://github.com/tobua/chinese-whisper-ai/raw/main/screenshot.png" alt="whisper-ai" width="300">
</p>

# Chinese Whisper AI - Challenge for Algorithm Arena

Browser-encrypted thread that can be shared through the url. Submission for the fifth weekly challenge on [Algorithm Arena](https://github.com/Algorithm-Arena/weekly-challenge-5-copy-pasta). The project uses **OpenAI API**, **Vercel Edge Runtime**, **Bun**, **React**, **TypeScript**, **Rsbuild** and **Biome**.

## Description

When the page loads randomly a Text, Voice or Image input is shown. Once the user enters something or uploads a file it can be converted into the next format. Conversion is handled by an Edge function using the OpenAI API. For these conversions most models are used: DALL·E 3, Whisper, GPT-4 Vision and TTS. This way it's possible to infinitely loop around letting the AI suprise you with it's creations. At any step it's possible for the user to download the current result and enter their own input. To make the time between the server-side conversions pass faster a big animated custom loader in SVG is rendered. In their respective forms images can be uploaded or added per drag-and-drop. When access is given to the microphone it's possible to record speech. While full transcription happens on the server using Whisper there is a preview of what's currently spoken if the respective `SpeechRecognition` API is available in the browser.

## Demo

See this [𝕏 Post](https://twitter.com/matthiasgiger/status/1759485186666807649) or try the [live version](https://chinese-whisper-ai.vercel.app).

https://github.com/Algorithm-Arena/weekly-challenge-5-copy-pasta/assets/15127551/fcbae898-5109-43bb-931a-c0805e862164

https://github.com/Algorithm-Arena/weekly-challenge-5-copy-pasta/assets/15127551/9ad86eb3-8edd-4e84-9b32-00edbbc9c4b3

## Installation

For the server to connect to the OpenAI API it's necessary to add a `.env` file with an `OPENAI_API_KEY` and a `OPENAI_ORGANIZATION` variable.

```sh
bun install
bun start # Start and open the application in the browser.
bun server # Start a local server for the Edge function.
bun format # Format files with Biome.
bun lint # Lint files with Biome.
bun run build & bun preview # Production preview.
```
