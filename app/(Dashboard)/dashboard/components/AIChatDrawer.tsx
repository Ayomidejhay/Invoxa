"use client";

import { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiX, FiSend, FiCpu, FiAlertCircle } from "react-icons/fi";
import { useTheme } from "@/app/context/ThemeContext";
import { useOrganization } from "../../components/OrganizationProvider";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type ChartConfig = {
  type: "bar" | "line" | "pie";
  title: string;
  data: { label: string; value: number }[];
  xAxisKey: string;
  yAxisKey: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  chart?: ChartConfig;
  error?: boolean;
};

const SUGGESTIONS = [
  "What is our outstanding balance?",
  "Compare sales vs rentals count",
  "Which customer spent the most?",
  "Which products are low on stock?",
];

// Helper to format bold markdown **text** and lists
function formatBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function parseMarkdown(text: string) {
  return text.split("\n\n").map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Bullet lists starting with - or *
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s+/, ""));
      return (
        <ul key={i} className="list-disc pl-5 space-y-1.5 my-2.5 text-zinc-700 dark:text-zinc-300">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: formatBold(item) }} />
          ))}
        </ul>
      );
    }

    // Numbered lists starting with "1. " or "2. "
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s+/, ""));
      return (
        <ol key={i} className="list-decimal pl-5 space-y-1.5 my-2.5 text-zinc-700 dark:text-zinc-300">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: formatBold(item) }} />
          ))}
        </ol>
      );
    }

    // Normal paragraph
    return (
      <p
        key={i}
        className="leading-relaxed text-sm mb-2 text-zinc-700 dark:text-zinc-300"
        dangerouslySetInnerHTML={{ __html: formatBold(trimmed).replace(/\n/g, "<br/>") }}
      />
    );
  });
}

const COLORS = ["#355834", "#C05621", "#3182CE", "#805AD5", "#319795", "#D69E2E"];

function AIChatChart({ chart }: { chart: ChartConfig }) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#A1A1AA" : "#71717A";
  const gridColor = theme === "dark" ? "#27272A" : "#E4E4E7";

  const renderChart = () => {
    switch (chart.type) {
      case "line":
        return (
          <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" stroke={textColor} fontSize={10} tickLine={false} />
            <YAxis stroke={textColor} fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181B" : "#FFFFFF",
                borderColor: theme === "dark" ? "#27272A" : "#E4E4E7",
                color: theme === "dark" ? "#FFFFFF" : "#09090B",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#355834" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={chart.data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={65}
              label={({ name, percent }) => `${(name || "").slice(0, 10)} (${((percent || 0) * 100).toFixed(0)}%)`}
              labelLine={false}
              style={{ fontSize: "9px", fill: textColor }}
            >
              {chart.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181B" : "#FFFFFF",
                borderColor: theme === "dark" ? "#27272A" : "#E4E4E7",
                color: theme === "dark" ? "#FFFFFF" : "#09090B",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
          </PieChart>
        );
      case "bar":
      default:
        return (
          <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" stroke={textColor} fontSize={10} tickLine={false} />
            <YAxis stroke={textColor} fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181B" : "#FFFFFF",
                borderColor: theme === "dark" ? "#27272A" : "#E4E4E7",
                color: theme === "dark" ? "#FFFFFF" : "#09090B",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="value" fill="#355834" radius={[4, 4, 0, 0]}>
              {chart.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 rounded-xl p-3.5 mt-3 select-none">
      <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 mb-3 text-center uppercase tracking-wider">
        {chart.title}
      </p>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function AIChatDrawer() {
  const { organization } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Welcome to **${organization.name}** AI Analyst!

I can help you review your invoicing, product stock level, payments history, or customer sales instantly.

Try asking me questions like:
- *"Who is our highest-paying customer?"*
- *"Show me our monthly revenue trends"*
- *"Which items are critically low in inventory?"*`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process query");
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.text,
        chart: data.chart,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error(error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: (error instanceof Error ? error.message : String(error)) || "An unexpected error occurred. Please verify your Gemini API key is configured.",
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#355834] text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 hover:bg-[#2c472c] transition-all duration-200 group focus:outline-none"
        title="Open AI Analyst"
      >
        <span className="relative flex h-6 w-6">
          <FiCpu className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
          {/* <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span> */}
        </span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/30 dark:bg-black/50 backdrop-blur-[1px] transition-opacity"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-[#1A1A1C] border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-250/60 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#355834]/10 dark:bg-[#355834]/20 flex items-center justify-center text-[#355834] dark:text-green-450">
              <FiCpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-dark dark:text-white">Invoxa AI Analyst</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium font-mono uppercase tracking-wider">
                  Ready to Analyze
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}
            >
              <div
                className={`p-3.5 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-[#355834] text-white rounded-br-none"
                    : msg.error
                    ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-900 dark:text-red-300 rounded-bl-none"
                    : "bg-slate-50 dark:bg-zinc-900/70 border border-slate-100 dark:border-zinc-800/80 rounded-bl-none text-zinc-800 dark:text-zinc-100"
                }`}
              >
                {msg.error && (
                  <div className="flex items-start gap-2 mb-2 font-semibold text-xs text-red-700 dark:text-red-400">
                    <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Analysis Error</span>
                  </div>
                )}
                <div className="text-sm select-text whitespace-pre-wrap">
                  {msg.role === "user" ? msg.text : parseMarkdown(msg.text)}
                </div>
                {msg.chart && <AIChatChart chart={msg.chart} />}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex flex-col mr-auto max-w-[85%]">
              <div className="p-4 bg-slate-50 dark:bg-zinc-900/70 border border-slate-100 dark:border-zinc-800/80 rounded-2xl rounded-bl-none text-zinc-800 dark:text-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#355834] dark:bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-[#355834] dark:bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-[#355834] dark:bg-green-500 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          {/* Suggestions List (shown only when not loading and drawer is ready) */}
          {!loading && messages.length === 1 && (
            <div className="pt-2 space-y-2">
              <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                Quick Questions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="text-xs text-left bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 px-3 py-2 rounded-xl transition-all duration-200 font-medium active:scale-[0.98]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-250/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask about revenue, stock levels, or customers..."
              className="flex-1 bg-white dark:bg-zinc-900 border border-slate-250 dark:border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 text-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-[#355834] dark:focus:ring-green-700 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-[#355834] dark:bg-[#355834] hover:bg-[#2c472c] text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:hover:bg-[#355834] shrink-0 active:scale-95"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
