"use client";

import { useEffect } from "react";
import {
  FullScreenContainer,
  ThemeProvider,
  PipecatAppBase,
  SpinLoader,
  type PipecatBaseChildProps,
} from "@pipecat-ai/voice-ui-kit";
import { App } from "./components/App";

// Import styles
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@pipecat-ai/voice-ui-kit/styles";

export default function Home() {
  // Use bot URL from environment or fallback to standard pipecat locahost setup
  const botURL = process.env.NEXT_PUBLIC_BOT_HOST || "http://localhost:8000";

  // Wake up the backend on page load to eliminate Render cold start delays
  useEffect(() => {
    const wakeBackend = async () => {
      try {
        await fetch(`${botURL}/health`);
        console.log("Backend warmed up");
      } catch (error) {
        console.log("Wake up request to backend failed or pending...");
      }
    };

    wakeBackend();
  }, [botURL]);

  return (
    <ThemeProvider>
      <FullScreenContainer>
        <PipecatAppBase
          transportType="smallwebrtc"
          connectParams={{
            webrtcUrl: `${botURL}/offer`,
          }}
          transportOptions={{
            waitForICEGathering: true,
          }}
        >
          {({
            client,
            handleConnect,
            handleDisconnect,
            error,
          }: PipecatBaseChildProps) =>
            !client ? (
              <SpinLoader />
            ) : (
              <App
                handleConnect={handleConnect}
                handleDisconnect={handleDisconnect}
                error={error}
              />
            )
          }
        </PipecatAppBase>
      </FullScreenContainer>
    </ThemeProvider>
  );
}
