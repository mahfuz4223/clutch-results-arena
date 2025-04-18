
import { ThemeOption } from "@/types";

// Define color themes for export
export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "pubg-blue",
    name: "PUBG Blue",
    preview: "#0A1F38",
    background: "bg-[#0A1F38]",
    headerBg: "bg-blue-900",
    textColor: "text-white",
    accentColor: "bg-blue-500",
    tableBg: "bg-blue-950/80",
    borderColor: "border-gray-700"
  },
  {
    id: "pubg-dark",
    name: "PUBG Dark",
    preview: "#121212",
    background: "bg-[#121212]",
    headerBg: "bg-zinc-900",
    textColor: "text-white",
    accentColor: "bg-yellow-500",
    tableBg: "bg-zinc-800/80",
    borderColor: "border-zinc-700"
  },
  {
    id: "pubg-green",
    name: "PUBG Military",
    preview: "#1C2B1F",
    background: "bg-[#1C2B1F]",
    headerBg: "bg-green-900",
    textColor: "text-white",
    accentColor: "bg-green-500",
    tableBg: "bg-green-950/80",
    borderColor: "border-green-800"
  },
  {
    id: "pubg-orange",
    name: "PUBG Orange",
    preview: "#2A1913",
    background: "bg-[#2A1913]",
    headerBg: "bg-orange-900",
    textColor: "text-white",
    accentColor: "bg-orange-500",
    tableBg: "bg-orange-950/80",
    borderColor: "border-orange-800"
  },
  {
    id: "pubg-red",
    name: "PUBG Red",
    preview: "#2A1213",
    background: "bg-[#2A1213]",
    headerBg: "bg-red-900",
    textColor: "text-white",
    accentColor: "bg-red-500",
    tableBg: "bg-red-950/80",
    borderColor: "border-red-800"
  },
  {
    id: "pubg-light",
    name: "PUBG Light",
    preview: "#F6F6F6",
    background: "bg-[#F6F6F6]",
    headerBg: "bg-gray-200",
    textColor: "text-gray-800",
    accentColor: "bg-blue-500",
    tableBg: "bg-white/90",
    borderColor: "border-gray-300"
  },
  {
    id: "pubg-purple",
    name: "PUBG Purple",
    preview: "#1F102A",
    background: "bg-[#1F102A]",
    headerBg: "bg-purple-900",
    textColor: "text-white",
    accentColor: "bg-purple-500",
    tableBg: "bg-purple-950/80",
    borderColor: "border-purple-800"
  }
];

export const getThemeById = (id: string): ThemeOption => {
  return THEME_OPTIONS.find(theme => theme.id === id) || THEME_OPTIONS[0];
};
