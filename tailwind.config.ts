import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: { "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite" }
    }
  },
  plugins: []
};
export default config;