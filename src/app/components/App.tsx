import {
  Button,
  ConnectButton,
  ErrorCard,
  UserAudioControl,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Progress,
} from "@pipecat-ai/voice-ui-kit";
import {
  usePipecatClientMediaTrack,
  usePipecatClientTransportState,
  usePipecatConversation,
} from "@pipecat-ai/client-react";
import {
  LogOutIcon,
  SettingsIcon,
  MessageSquareIcon,
  CpuIcon,
  ShieldCheckIcon,
  TerminalIcon,
  ZapIcon,
  ActivityIcon,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";

export interface AppProps {
  handleConnect?: () => void | Promise<void>;
  handleDisconnect?: () => void | Promise<void>;
  error?: string | null;
}

export const App = ({ handleConnect, handleDisconnect, error }: AppProps) => {
  const state = usePipecatClientTransportState();
  const videoTrack = usePipecatClientMediaTrack("video", "bot");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(true);

  // Hook into conversation messages
  const { messages } = usePipecatConversation();

  // Filter messages for display (showing both assistant and user), and flatten parts to text
  const conversationMessages = useMemo(
    () =>
      messages
        .filter((m) => m.role === "assistant" || m.role === "user")
        .map((m) => ({
          ...m,
          renderedText: m.parts
            .map((part) =>
              typeof part.text === "string"
                ? part.text
                : (part.text as { spoken?: string }).spoken || "",
            )
            .filter(Boolean)
            .join(" "),
        })),
    [messages],
  );
  // Keep bottom of logs in view
  const logEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showLogs, conversationMessages]);

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      videoRef.current.srcObject = new MediaStream([videoTrack]);
    }
  }, [videoTrack]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 p-8">
        <ErrorCard error={error} title="System Link Failure." />
      </div>
    );
  }

  // We only show controls if connected
  const isConnected = state === "connected" || state === "ready";

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden text-stone-900 font-sans selection:bg-orange-200 bg-[#FCF9F5]">
      {/* HUD Header */}
      <header className="flex items-center justify-between h-20 px-8 glass-panel border-x-0 border-t-0 z-50 sticky top-0 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full ${isConnected ? "bg-orange-400 shadow-[0_0_12px_#d4a373]" : "bg-stone-300"} ${isConnected ? "status-pulse" : ""}`}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">
              AMBILIO OS{" "}
              <span className="text-stone-500 font-mono text-xs ml-2">
                v4.2.0-soft
              </span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-600 font-bold mt-0.5">
              <ShieldCheckIcon size={10} className="text-orange-600" />
              Verified Secure Sync
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-stone-500 uppercase font-bold tracking-tighter">
                Latency
              </span>
              <span className="text-xs font-mono text-orange-700 font-bold">
                24ms
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-stone-500 uppercase font-bold tracking-tighter">
                Uptime
              </span>
              <span className="text-xs font-mono text-amber-700 font-bold">
                99.98%
              </span>
            </div>
          </div>
          <Badge
            color={isConnected ? "success" : "warning"}
            variant="elbow"
            className="font-mono text-[10px] px-3 bg-orange-100 text-orange-800 border-orange-300 font-bold"
          >
            {isConnected ? "ACTIVE_SESSION" : "IDLE_STANDBY"}
          </Badge>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Side: Interaction & Visuals */}
        <section className="flex-[3] flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 relative rounded-[2rem] overflow-hidden glass-panel video-frame group transition-all duration-700 shadow-xl border-orange-100/50">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={false}
              className={`w-full h-full object-cover transition-all duration-1000 ${isConnected ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            />

            {!isConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 overflow-hidden bg-stone-50/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,115,0.1)_0%,transparent_70%)]" />

                <div className="z-10 text-center flex flex-col items-center max-w-lg">
                  <div className="w-16 h-16 rounded-full border border-orange-200 flex items-center justify-center mb-8 relative bg-white/50">
                    <CpuIcon className="text-orange-400 w-8 h-8" />
                    <div className="absolute inset-0 rounded-full border-2 border-orange-200/50 animate-ping" />
                  </div>
                  <h2 className="text-5xl font-extrabold tracking-tighter mb-4 text-stone-900 uppercase">
                    Ambilio
                    <br />
                    Avatar
                  </h2>
                  <p className="text-stone-600 text-base font-medium leading-relaxed mb-10 max-w-sm">
                    Experience a warmer, more natural digital interaction.
                    Establishing secure encrypted tunnel for low-latency
                    synthesis.
                  </p>
                  <ConnectButton
                    size="xl"
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 text-white"
                  />
                </div>
              </div>
            )}

            {/* In-Video HUD Overlays */}
            {isConnected && (
              <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-orange-100">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest text-orange-700 uppercase">
                    LIVE_FEED
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="h-32 grid grid-cols-4 gap-4">
            {[
              {
                icon: TerminalIcon,
                label: "Transport",
                value: "smallwebrtc",
                color: "text-orange-500",
              },
              {
                icon: ZapIcon,
                label: "Sync",
                value: "Perfect",
                color: "text-amber-500",
              },
              {
                icon: ShieldCheckIcon,
                label: "Shield",
                value: "Verified",
                color: "text-stone-500",
              },
              {
                icon: ActivityIcon,
                label: "Pulse",
                value: "Steady",
                color: "text-stone-400",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass-panel rounded-2xl p-4 flex flex-col justify-between group hover:border-orange-300 transition-colors"
              >
                <stat.icon
                  size={16}
                  className={`${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                />
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-tighter">
                    {stat.label}
                  </p>
                  <p className="text-sm font-mono text-stone-700 mt-1 uppercase tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side: Control & Logs */}
        <aside className="w-100 flex flex-col gap-4">
          <div className="flex-1 glass-panel rounded-[2rem] flex flex-col overflow-hidden shadow-lg border-orange-100/50">
            <header className="px-6 py-6 border-b border-orange-100/50 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-3">
                <TerminalIcon size={16} className="text-orange-600 font-bold" />
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-700">
                  Interaction Log
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className={`p-1.5 rounded-lg transition-colors ${showLogs ? "bg-orange-200 text-orange-900 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}
                >
                  <MessageSquareIcon size={14} />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-lg transition-colors ${showSettings ? "bg-orange-200 text-orange-900 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}
                >
                  <SettingsIcon size={14} />
                </button>
                <button
                  onClick={handleDisconnect}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-100 transition-all font-bold"
                >
                  <LogOutIcon size={14} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar space-y-4">
              {conversationMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 gap-4 opacity-70">
                  <div className="p-4 rounded-full border border-dashed border-stone-200">
                    <MessageSquareIcon size={24} />
                  </div>
                  <p className="text-[11px] uppercase tracking-widest font-black text-stone-500">
                    Waiting for voice sync
                  </p>
                </div>
              ) : (
                conversationMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-2 ${msg.role === "assistant" ? "pr-8" : "pl-8 items-end"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-tighter ${msg.role === "assistant" ? "text-orange-700 underline" : "text-stone-600"}`}
                      >
                        {msg.role}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold font-mono">
                        [
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        ]
                      </span>
                    </div>
                    <div
                      className={`text-[14px] font-medium leading-relaxed p-4 rounded-2xl shadow-sm border ${msg.role === "assistant" ? "bg-white text-stone-900 border-orange-100/50 shadow-orange-100/30" : "bg-orange-500 text-white border-orange-400 shadow-orange-200/50"}`}
                    >
                      {msg.renderedText || "..."}
                    </div>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>

            <footer className="p-6 bg-stone-50/50 border-t border-stone-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-black text-stone-600 tracking-tighter">
                  Audio Sensitivity
                </span>
                <UserAudioControl />
              </div>
              {isConnected && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black font-mono text-orange-800 uppercase">
                      <span>Signal Strength</span>
                      <span>HIGH</span>
                    </div>
                    <Progress
                      percent={92}
                      size="xs"
                      color="active"
                      className="bg-orange-100 h-2"
                    />
                  </div>
                </div>
              )}
            </footer>
          </div>
        </aside>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/10 backdrop-blur-md">
          <div className="w-full max-w-md bg-white border border-stone-100 rounded-[32px] p-10 animate-in zoom-in-95 duration-200 shadow-2xl shadow-orange-200/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-stone-800 flex items-center gap-3 tracking-tight">
                <SettingsIcon className="text-orange-500" />
                SYSTEM_CONFIG
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-stone-300 hover:text-stone-500 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-stone-600 tracking-widest">
                  Interface Node
                </label>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 font-mono text-xs text-orange-700 font-bold break-all shadow-inner">
                  {process.env.NEXT_PUBLIC_BOT_HOST || "http://localhost:7860"}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-stone-600 tracking-widest">
                  Hardware Status
                </label>
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-sm font-bold text-stone-800">
                    Active Microphone
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-600 shadow-[0_0_10px_#ea580c]" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-12 py-5 bg-stone-900 hover:bg-black text-white rounded-2xl font-bold tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-stone-200"
            >
              CONFIRM_UPDATE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
