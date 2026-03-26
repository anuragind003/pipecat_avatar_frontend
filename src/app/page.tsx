"use client";

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
  const botURL = process.env.NEXT_PUBLIC_BOT_HOST || "http://localhost:7860";

  return (
    <ThemeProvider>
      <FullScreenContainer>
        <PipecatAppBase
          transportType="smallwebrtc"
          startBotParams={{
            endpoint: `${botURL}/start`,
            requestData: {
              createDailyRoom: false,
              enableDefaultIceServers: true,
              transport: "webrtc",
            },
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
