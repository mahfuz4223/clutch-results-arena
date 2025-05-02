
export interface Team {
  id: string;
  name: string;
  logo?: string;
  flag?: string;
  players?: Player[];
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
}

export interface Match {
  id: string;
  name: string;
  dayId: string;
  tournamentId: string;
  results: MatchResult[];
}

export interface MatchResult {
  teamId: string;
  placement: number;
  kills: number;
  placementPoints: number;
  killPoints: number;
  totalPoints: number;
}

export interface Day {
  id: string;
  name: string;
  tournamentId: string;
  matches: Match[];
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  days: Day[];
  teams: Team[];
}

export interface ThemeOption {
  id: string;
  name: string;
  background: string;
  textColor: string;
  accentColor: string;
  headerBg: string;
  tableBg: string;
  borderColor: string;
  preview?: string;
}

export interface CustomizationOptions {
  theme: string;
  background: string;
  cssPreset?: string;
  customCss?: string;
  showSponsors: boolean;
  showGridLines: boolean;
  showTencentLogo: boolean;
  showPubgLogo: boolean;
  showTournamentLogo: boolean;
  footerText?: string;
  logoUrl?: string;
  customBackgroundUrl?: string;
}

export interface BannerTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  properties: {
    showGrid: boolean;
    showCharacter: boolean;
    useGradient: boolean;
  };
  preview?: string;
}

export interface BannerThemeConfig {
  containerClasses: string;
  containerStyle: object;
  titleClasses: string;
  mainTitleClasses: string;
  subtitleClasses: string;
  dividerClasses: string;
  tableClasses: string;
  tableHeaderClasses: string;
  placeLabel: string;
  killsLabel: string;
  rankClasses: string;
  pointsClasses: string;
  footerClasses: string;
  showDivider: boolean;
  showGrid: boolean;
  showCharacter: boolean;
  titlePrefix?: string;
  backgroundImage?: string;
  getRowClasses: (index: number) => string;
}
