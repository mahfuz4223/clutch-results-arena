
/**
 * Calculate placement points based on the position
 * 1st: 10, 2nd: 7, 3rd: 6, 4th: 4, 5th: 3, 6th: 2, 7th: 2, 8th-10th: 1, 11th+: 0
 */
export const calculatePlacementPoints = (placement: number): number => {
  switch (placement) {
    case 1: return 10;
    case 2: return 7;
    case 3: return 6;
    case 4: return 4;
    case 5: return 3;
    case 6: return 2;
    case 7: return 2;
    case 8:
    case 9:
    case 10: return 1;
    default: return 0;
  }
};

/**
 * Calculate total points (placement points + kill points)
 */
export const calculateTotalPoints = (placementPoints: number, killPoints: number): number => {
  return placementPoints + killPoints;
};

/**
 * Get team's total kill points across all matches in a day
 */
export const getTotalKillPoints = (teamId: string, matchResults: any[]): number => {
  return matchResults.reduce((total, match) => {
    const teamResult = match.results.find((result: any) => result.teamId === teamId);
    return total + (teamResult?.killPoints || 0);
  }, 0);
};

/**
 * Get team's total placement points across all matches in a day
 */
export const getTotalPlacementPoints = (teamId: string, matchResults: any[]): number => {
  return matchResults.reduce((total, match) => {
    const teamResult = match.results.find((result: any) => result.teamId === teamId);
    return total + (teamResult?.placementPoints || 0);
  }, 0);
};

/**
 * Get team's WWCD (Winner Winner Chicken Dinner) count across matches
 */
export const getWWCDCount = (teamId: string, matchResults: any[]): number => {
  return matchResults.reduce((count, match) => {
    const teamResult = match.results.find((result: any) => result.teamId === teamId);
    return count + (teamResult?.placement === 1 ? 1 : 0);
  }, 0);
};

/**
 * Calculate overall standings for all teams across multiple matches
 */
export const calculateOverallStandings = (teams: any[], matches: any[]): any[] => {
  // Create a map to store aggregated stats for each team
  const teamStats = new Map();
  
  // Initialize stats for each team
  teams.forEach(team => {
    teamStats.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      teamFlag: team.flag,
      teamLogo: team.logo,
      totalKills: 0,
      totalPlacementPoints: 0,
      totalPoints: 0,
      wwcd: 0
    });
  });
  
  // Aggregate stats from all matches
  matches.forEach(match => {
    match.results.forEach((result: any) => {
      const teamStat = teamStats.get(result.teamId);
      if (teamStat) {
        teamStat.totalKills += result.kills || 0;
        teamStat.totalPlacementPoints += result.placementPoints || 0;
        teamStat.totalPoints += result.totalPoints || 0;
        teamStat.wwcd += result.placement === 1 ? 1 : 0;
      }
    });
  });
  
  // Convert map to array and sort by total points (descending)
  return Array.from(teamStats.values())
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((stats, index) => ({
      ...stats,
      rank: index + 1
    }));
};
