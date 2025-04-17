
import { ThemeOption } from "@/types";

export const THEME_OPTIONS: { id: string; name: string }[] = [
  { id: "pubg-blue", name: "PUBG Blue" },
  { id: "blue", name: "Blue" },
  { id: "red", name: "Red" },
  { id: "dark", name: "Dark" },
  { id: "purple", name: "Purple" },
  { id: "gradient", name: "Gradient" },
];

export const getThemeById = (id: string): ThemeOption => {
  switch (id) {
    case "pubg-blue":
      return {
        background: "bg-blue-900",
        headerBg: "bg-blue-800",
        textColor: "text-white",
        accentColor: "bg-blue-400",
        tableBg: "bg-blue-800/50",
        borderColor: "border-blue-700"
      };
    case "blue":
      return {
        background: "bg-blue-50",
        headerBg: "bg-blue-700",
        textColor: "text-gray-900",
        accentColor: "bg-blue-500",
        tableBg: "bg-white",
        borderColor: "border-blue-200"
      };
    case "red":
      return {
        background: "bg-red-50",
        headerBg: "bg-red-700",
        textColor: "text-gray-900",
        accentColor: "bg-red-500",
        tableBg: "bg-white",
        borderColor: "border-red-200"
      };
    case "dark":
      return {
        background: "bg-gray-900",
        headerBg: "bg-gray-800",
        textColor: "text-white",
        accentColor: "bg-gray-600",
        tableBg: "bg-gray-800",
        borderColor: "border-gray-700"
      };
    case "purple":
      return {
        background: "bg-purple-50",
        headerBg: "bg-purple-700",
        textColor: "text-gray-900",
        accentColor: "bg-purple-500",
        tableBg: "bg-white",
        borderColor: "border-purple-200"
      };
    case "gradient":
      return {
        background: "bg-gradient-to-br from-indigo-800 via-blue-800 to-cyan-800",
        headerBg: "bg-indigo-900/70",
        textColor: "text-white",
        accentColor: "bg-cyan-400",
        tableBg: "bg-indigo-900/40",
        borderColor: "border-blue-700"
      };
    default:
      return {
        background: "bg-blue-50",
        headerBg: "bg-blue-700",
        textColor: "text-gray-900",
        accentColor: "bg-blue-500",
        tableBg: "bg-white",
        borderColor: "border-blue-200"
      };
  }
};
