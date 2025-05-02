
import { BannerTheme } from "@/types";

export const BANNER_THEMES: BannerTheme[] = [
  {
    id: "pubg-official",
    name: "PUBG Official",
    colors: {
      primary: "#00acbf",
      secondary: "#222222",
      accent: "#00acbf",
      background: "black",
    },
    properties: {
      showGrid: true,
      showCharacter: true,
      useGradient: false,
    },
    preview: "pubg-theme.png",
  },
  {
    id: "pmgo-2025",
    name: "PMGO 2025",
    colors: {
      primary: "#33bbff",
      secondary: "#0077cc",
      accent: "#33bbff",
      background: "#001940",
    },
    properties: {
      showGrid: true,
      showCharacter: true,
      useGradient: true,
    },
    preview: "pmgo-theme.png",
  },
  {
    id: "esports-dark",
    name: "Esports Dark",
    colors: {
      primary: "#ff3c3c",
      secondary: "#222222",
      accent: "#ff3c3c",
      background: "#111111",
    },
    properties: {
      showGrid: false,
      showCharacter: false,
      useGradient: false,
    },
    preview: "esports-dark.png",
  },
  {
    id: "blue-gradient",
    name: "Blue Gradient",
    colors: {
      primary: "#66d9ff",
      secondary: "#0051a8",
      accent: "#66d9ff",
      background: "#0033a8",
    },
    properties: {
      showGrid: false,
      showCharacter: false,
      useGradient: true,
    },
    preview: "blue-gradient.png",
  },
  {
    id: "cyber-league",
    name: "Cyber League",
    colors: {
      primary: "#ef5fff",
      secondary: "#00ccee",
      accent: "#ef5fff",
      background: "#1e0054",
    },
    properties: {
      showGrid: false,
      showCharacter: false,
      useGradient: true,
    },
    preview: "cyber-league.png",
  },
];

export function getBannerThemeById(id: string): BannerTheme {
  return BANNER_THEMES.find(theme => theme.id === id) || BANNER_THEMES[0];
}
