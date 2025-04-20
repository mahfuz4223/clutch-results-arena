
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
    id: "pubg-official",
    name: "PUBG Official",
    background: "bg-black",
    textColor: "text-white",
    accentColor: "bg-teal-400",
    headerBg: "bg-black",
    tableBg: "bg-black/90",
    borderColor: "border-teal-500",
    preview: "pubg-official"
  },
  {
    id: "pubg-survival",
    name: "PUBG Survival",
    background: "bg-gradient-to-br from-gray-800 to-gray-900",
    textColor: "text-white",
    accentColor: "bg-teal-500",
    headerBg: "bg-black/90",
    tableBg: "bg-gray-900/80",
    borderColor: "border-teal-500",
    preview: "pubg-survival"
  },
  {
    id: "pubg-erangel",
    name: "PUBG Erangel",
    background: "bg-gradient-to-br from-green-900 to-blue-900",
    textColor: "text-white",
    accentColor: "bg-yellow-500",
    headerBg: "bg-black/80",
    tableBg: "bg-green-900/70",
    borderColor: "border-yellow-600",
    preview: "pubg-erangel"
  },
  {
    id: "pubg-miramar",
    name: "PUBG Miramar",
    background: "bg-gradient-to-br from-amber-800 to-amber-950",
    textColor: "text-white",
    accentColor: "bg-amber-500",
    headerBg: "bg-amber-950/90",
    tableBg: "bg-amber-900/70",
    borderColor: "border-amber-600",
    preview: "pubg-miramar"
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

// Predefined background images for selection
export const BACKGROUND_OPTIONS = [
  { id: "none", name: "None", url: "" },
  { id: "erangel", name: "Erangel", url: "/public/lovable-uploads/145b7ad5-318f-4bb7-9898-1bda1ca6c14b.png" },
  { id: "miramar", name: "Miramar", url: "/public/lovable-uploads/8ec78efa-0c83-458a-b34d-11d6da1a7045.png" },
  { id: "parachute", name: "Parachute Drop", url: "/public/lovable-uploads/6c8175da-7008-4839-a7ff-40a2682dc5a5.png" },
  { id: "player", name: "PUBG Player", url: "/public/lovable-uploads/eee7c14b-7b13-4498-b25b-8adfdaa92a47.png" },
  { id: "grid", name: "Grid Pattern", url: "/public/lovable-uploads/49b6f4b0-4b79-45ae-a219-75aae6f4d80b.png" },
  { id: "dark-grid", name: "Dark Grid", url: "/public/lovable-uploads/ef62d711-f3b9-47c8-97a6-39cb861a0425.png" },
];

// CSS presets for advanced customization
export const CSS_PRESETS = [
  { 
    id: "official", 
    name: "Official PUBG Style", 
    css: `
.result-card {
  background-color: #000000;
  background-image: url('/public/lovable-uploads/ef62d711-f3b9-47c8-97a6-39cb861a0425.png');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  color: white;
  font-family: 'Arial', sans-serif;
  position: relative;
}

.result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%);
  z-index: 0;
}

.result-card * {
  z-index: 1;
  position: relative;
}

.header-title {
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(0,172,193,0.5);
}

.day-title {
  font-size: 2.5rem;
  color: #00acbf;
  text-transform: uppercase;
  font-weight: 800;
  border: 3px solid #00acbf;
  padding: 0.25rem 1rem;
}

.table-header {
  background-color: #00303a;
}

.table-row:nth-child(odd) {
  background-color: rgba(0,47,60,0.7);
}

.table-row:nth-child(even) {
  background-color: rgba(0,30,37,0.7);
}

.team-rank {
  color: #00acbf;
  font-weight: 900;
  font-size: 1.1rem;
}

.total-points {
  color: #00acbf;
  font-weight: 700;
}

.footer {
  background-color: rgba(0,0,0,0.8);
}
    `
  },
  { 
    id: "competitive", 
    name: "Competitive Esports", 
    css: `
.result-card {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  font-family: 'Roboto', sans-serif;
}

.header-title {
  font-size: a3rem;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.day-title {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #f5af19, #f12711);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.table-header {
  background-color: rgba(0,0,0,0.5);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}

.table-row {
  border-bottom: 1px solid rgba(255,255,255,0.1);
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: rgba(245,175,25,0.1);
}

.team-rank {
  font-weight: 900;
  color: white;
}

.total-points {
  font-weight: 700;
  color: #f5af19;
}

.footer {
  background-color: rgba(0,0,0,0.7);
  font-size: 0.8rem;
}
    `
  },
  { 
    id: "minimal", 
    name: "Minimal Clean", 
    css: `
.result-card {
  background-color: #141414;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.day-title {
  font-size: 2rem;
  color: #64ffda;
  font-weight: 600;
}

.table-header {
  background-color: #1a1a1a;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #868686;
}

.table-row {
  background-color: #202020;
  border-bottom: 1px solid #303030;
}

.table-row:nth-child(even) {
  background-color: #252525;
}

.team-rank {
  color: #64ffda;
  font-weight: 700;
}

.total-points {
  color: white;
  font-weight: 600;
}

.footer {
  background-color: #101010;
  font-size: 0.7rem;
  color: #707070;
}
    `
  }
];

export function getThemeById(id: string): ThemeOption {
  return THEME_OPTIONS.find(theme => theme.id === id) || THEME_OPTIONS[0];
}

export function getBackgroundById(id: string): string {
  const bg = BACKGROUND_OPTIONS.find(bg => bg.id === id);
  return bg ? bg.url : "";
}

export function getCssPresetById(id: string): string {
  const preset = CSS_PRESETS.find(preset => preset.id === id);
  return preset ? preset.css : "";
}
