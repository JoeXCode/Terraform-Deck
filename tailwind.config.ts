import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.tsx", "./components/**/*.tsx", "./lib/**/*.tsx", "./data/**/*.tsx"],
  theme: {
    extend: {
      colors: { bg: "#0B0F14", panel: "#121923", line: "#2A3A50", ink: "#E6EDF3", mute: "#8B9BB0", tf: "#7B42BC", aws: "#FF9900" },
      fontFamily: { sans: ["Inter Variable", "Inter", "system-ui", "sans-serif"], mono: ["JetBrains Mono Variable", "JetBrains Mono", "ui-monospace", "monospace"] },
    },
  },
} satisfies Config;
