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
