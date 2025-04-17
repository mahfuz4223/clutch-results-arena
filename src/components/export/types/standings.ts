
// Export types used in the results and standings components
export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamFlag?: string;
  wwcd: number;
  totalPlacementPoints: number;
  totalKills: number;
  totalPoints: number;
  rank: number;
}
