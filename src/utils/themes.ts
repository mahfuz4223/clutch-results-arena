
import { ThemeOption } from "@/types";

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "pubg-classic",
    name: "PUBG Classic",
    background: "bg-gradient-to-br from-gray-900 to-blue-900",
    textColor: "text-white",
    accentColor: "bg-yellow-500",
    headerBg: "bg-black/80",
    tableBg: "bg-gray-900/80",
    borderColor: "border-yellow-600",
    preview: "pubg-theme"
  },
  {
    id: "battlegrounds",
    name: "Battlegrounds",
    background: "bg-gradient-to-br from-stone-800 to-stone-900",
    textColor: "text-white",
    accentColor: "bg-amber-500",
    headerBg: "bg-black/90",
    tableBg: "bg-black/70",
    borderColor: "border-amber-700",
    preview: "battlegrounds-theme"
  },
  {
    id: "blue-classic",
    name: "Blue Classic",
    background: "bg-gradient-to-br from-blue-700 to-blue-900",
    textColor: "text-white",
    accentColor: "bg-blue-500",
    headerBg: "bg-blue-800/80",
    tableBg: "bg-blue-800/60",
    borderColor: "border-blue-600",
    preview: "blue-theme"
  },
  {
    id: "red-energy",
    name: "Red Energy",
    background: "bg-gradient-to-br from-red-700 to-pink-900",
    textColor: "text-white",
    accentColor: "bg-pink-600",
    headerBg: "bg-red-800/80",
    tableBg: "bg-red-900/70",
    borderColor: "border-red-600",
    preview: "red-theme"
  },
  {
    id: "dark-elite",
    name: "Dark Elite",
    background: "bg-gradient-to-br from-gray-800 to-gray-900",
    textColor: "text-white",
    accentColor: "bg-yellow-500",
    headerBg: "bg-black/80",
    tableBg: "bg-gray-900/80",
    borderColor: "border-gray-700",
    preview: "dark-theme"
  },
  {
    id: "cyber-future",
    name: "Cyber Future",
    background: "bg-gradient-to-br from-purple-800 to-blue-900",
    textColor: "text-white",
    accentColor: "bg-cyan-400",
    headerBg: "bg-purple-900/80",
    tableBg: "bg-indigo-900/70",
    borderColor: "border-purple-600",
    preview: "cyber-theme"
  },
  {
    id: "esports-pro",
    name: "Esports Pro",
    background: "bg-gradient-to-br from-indigo-800 via-blue-800 to-cyan-800",
    textColor: "text-white",
    accentColor: "bg-cyan-500",
    headerBg: "bg-indigo-900/90",
    tableBg: "bg-blue-900/80",
    borderColor: "border-blue-700",
    preview: "esports-theme"
  }
];

export function getThemeById(id: string): ThemeOption {
  return THEME_OPTIONS.find(theme => theme.id === id) || THEME_OPTIONS[0];
}
