
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Tournament, Team, Day, Match, MatchResult } from "@/types";
import { calculatePlacementPoints, calculateTotalPoints } from "@/utils/pointCalculator";
import { v4 as uuidv4 } from "uuid";

interface TournamentContextType {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  createTournament: (name: string, description?: string) => Tournament;
  updateTournament: (tournament: Tournament) => void;
  deleteTournament: (id: string) => void;
  selectTournament: (id: string) => void;
  addTeam: (name: string, flag?: string, logo?: string) => Team;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  addDay: (name: string) => Day;
  updateDay: (day: Day) => void;
  deleteDay: (id: string) => void;
  addMatch: (name: string, dayId: string) => Match;
  updateMatch: (match: Match) => void;
  deleteMatch: (id: string) => void;
  updateMatchResults: (matchId: string, results: MatchResult[]) => void;
}

const defaultContext: TournamentContextType = {
  tournaments: [],
  currentTournament: null,
  createTournament: () => ({ id: "", name: "", days: [], teams: [] }),
  updateTournament: () => {},
  deleteTournament: () => {},
  selectTournament: () => {},
  addTeam: () => ({ id: "", name: "", teamId: "" }),
  updateTeam: () => {},
  deleteTeam: () => {},
  addDay: () => ({ id: "", name: "", tournamentId: "", matches: [] }),
  updateDay: () => {},
  deleteDay: () => {},
  addMatch: () => ({ id: "", name: "", dayId: "", tournamentId: "", results: [] }),
  updateMatch: () => {},
  deleteMatch: () => {},
  updateMatchResults: () => {}
};

export const TournamentContext = createContext<TournamentContextType>(defaultContext);

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);

  // Tournament operations
  const createTournament = (name: string, description?: string): Tournament => {
    const newTournament: Tournament = {
      id: uuidv4(),
      name,
      description,
      days: [],
      teams: []
    };
    setTournaments(prev => [...prev, newTournament]);
    setCurrentTournament(newTournament);
    return newTournament;
  };

  const updateTournament = (tournament: Tournament) => {
    setTournaments(prev => 
      prev.map(t => t.id === tournament.id ? tournament : t)
    );
    if (currentTournament?.id === tournament.id) {
      setCurrentTournament(tournament);
    }
  };

  const deleteTournament = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    if (currentTournament?.id === id) {
      setCurrentTournament(null);
    }
  };

  const selectTournament = (id: string) => {
    const tournament = tournaments.find(t => t.id === id) || null;
    setCurrentTournament(tournament);
  };

  // Team operations
  const addTeam = (name: string, flag?: string, logo?: string): Team => {
    if (!currentTournament) throw new Error("No tournament selected");
    
    const newTeam: Team = {
      id: uuidv4(),
      name,
      flag,
      logo,
      players: []
    };
    
    const updatedTournament = {
      ...currentTournament,
      teams: [...currentTournament.teams, newTeam]
    };
    
    updateTournament(updatedTournament);
    return newTeam;
  };

  const updateTeam = (team: Team) => {
    if (!currentTournament) return;
    
    const updatedTournament = {
      ...currentTournament,
      teams: currentTournament.teams.map(t => t.id === team.id ? team : t)
    };
    
    updateTournament(updatedTournament);
  };

  const deleteTeam = (id: string) => {
    if (!currentTournament) return;
    
    const updatedTournament = {
      ...currentTournament,
      teams: currentTournament.teams.filter(t => t.id !== id)
    };
    
    updateTournament(updatedTournament);
  };

  // Day operations
  const addDay = (name: string): Day => {
    if (!currentTournament) throw new Error("No tournament selected");
    
    const newDay: Day = {
      id: uuidv4(),
      name,
      tournamentId: currentTournament.id,
      matches: []
    };
    
    const updatedTournament = {
      ...currentTournament,
      days: [...currentTournament.days, newDay]
    };
    
    updateTournament(updatedTournament);
    return newDay;
  };

  const updateDay = (day: Day) => {
    if (!currentTournament) return;
    
    const updatedTournament = {
      ...currentTournament,
      days: currentTournament.days.map(d => d.id === day.id ? day : d)
    };
    
    updateTournament(updatedTournament);
  };

  const deleteDay = (id: string) => {
    if (!currentTournament) return;
    
    const updatedTournament = {
      ...currentTournament,
      days: currentTournament.days.filter(d => d.id !== id)
    };
    
    updateTournament(updatedTournament);
  };

  // Match operations
  const addMatch = (name: string, dayId: string): Match => {
    if (!currentTournament) throw new Error("No tournament selected");
    
    const newMatch: Match = {
      id: uuidv4(),
      name,
      dayId,
      tournamentId: currentTournament.id,
      results: []
    };
    
    const updatedTournament = {
      ...currentTournament,
      days: currentTournament.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            matches: [...day.matches, newMatch]
          };
        }
        return day;
      })
    };
    
    updateTournament(updatedTournament);
    return newMatch;
  };

  const updateMatch = (match: Match) => {
    if (!currentTournament) return;
    
    const updatedTournament = {
      ...currentTournament,
      days: currentTournament.days.map(day => {
        if (day.id === match.dayId) {
          return {
            ...day,
            matches: day.matches.map(m => m.id === match.id ? match : m)
          };
        }
        return day;
      })
    };
    
    updateTournament(updatedTournament);
  };

  const deleteMatch = (id: string) => {
    if (!currentTournament) return;
    
    const updatedTournament = {
      ...currentTournament,
      days: currentTournament.days.map(day => {
        return {
          ...day,
          matches: day.matches.filter(m => m.id !== id)
        };
      })
    };
    
    updateTournament(updatedTournament);
  };

  const updateMatchResults = (matchId: string, results: MatchResult[]) => {
    if (!currentTournament) return;
    
    // Calculate placement points and total points for each result
    const calculatedResults = results.map(result => {
      const placementPoints = calculatePlacementPoints(result.placement);
      const killPoints = result.kills;
      const totalPoints = calculateTotalPoints(placementPoints, killPoints);
      
      return {
        ...result,
        placementPoints,
        killPoints,
        totalPoints
      };
    });
    
    // Find and update the match
    const updatedTournament = {
      ...currentTournament,
      days: currentTournament.days.map(day => {
        return {
          ...day,
          matches: day.matches.map(match => {
            if (match.id === matchId) {
              return {
                ...match,
                results: calculatedResults
              };
            }
            return match;
          })
        };
      })
    };
    
    updateTournament(updatedTournament);
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        currentTournament,
        createTournament,
        updateTournament,
        deleteTournament,
        selectTournament,
        addTeam,
        updateTeam,
        deleteTeam,
        addDay,
        updateDay,
        deleteDay,
        addMatch,
        updateMatch,
        deleteMatch,
        updateMatchResults
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};
