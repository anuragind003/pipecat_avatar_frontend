# Ambilio Avatar Frontend

This is the **Next.js frontend** for the Ambilio Avatar application, built with [Pipecat AI](https://github.com/pipecat-ai/pipecat)'s UI kit. It provides a real-time WebRTC interface for interacting with a lip-synced avatar.

## Features

- **WebRTC**: Real-time communication for low-latency interactions.
- **Voice UI**: Ready-to-use Pipecat UI components for voice/video.
- **Next.js**: Modern React framework for high performance.
- **Dynamic Connection**: Connects to the Pipecat backend server automatically.

## Prerequisites

- Node.js 18+
- [npm](https://www.npmjs.com/) (recommended) or `yarn`

## Getting Started

1. **Install dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**:
   Create a `.env.local` file in the `frontend/` directory (optional):

   ```ini
   NEXT_PUBLIC_BOT_HOST=http://localhost:7860
   ```

   _Note: If not set, it defaults to `http://localhost:7860`._

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app/page.tsx`: Main entry point setting up `<PipecatAppBase>`.
- `src/app/components/App.tsx`: Main application UI handling connection states.
- `public/`: Static assets.

## Integration

The frontend connects to the backend at `${NEXT_PUBLIC_BOT_HOST}/start`. The backend receives a `transport: "webrtc"` parameter to initialize the session.

## Notes

- **Microphone Access**: Ensure your browser has permission to access the microphone for STT to work.
- **Camera Access**: If the backend is configured for video-in, camera access will be requested.
- **Tailwind CSS**: Uses Tailwind v4 for styling.
