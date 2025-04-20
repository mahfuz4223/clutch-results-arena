
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Tournament, Team, Day, Match, MatchResult } from "@/types";
import { calculatePlacementPoints, calculateTotalPoints } from "@/utils/pointCalculator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface TournamentContextType {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  loading: boolean;
  createTournament: (name: string, description?: string) => Promise<Tournament | null>;
  updateTournament: (tournament: Tournament) => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  selectTournament: (id: string) => Promise<void>;
  addTeam: (name: string, flag?: string, logo?: string) => Promise<Team | null>;
  updateTeam: (team: Team) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addDay: (name: string) => Promise<Day | null>;
  updateDay: (day: Day) => Promise<void>;
  deleteDay: (id: string) => Promise<void>;
  addMatch: (name: string, dayId: string) => Promise<Match | null>;
  updateMatch: (match: Match) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  updateMatchResults: (matchId: string, results: MatchResult[]) => Promise<void>;
}

const defaultContext: TournamentContextType = {
  tournaments: [],
  currentTournament: null,
  loading: true,
  createTournament: async () => null,
  updateTournament: async () => {},
  deleteTournament: async () => {},
  selectTournament: async () => {},
  addTeam: async () => null,
  updateTeam: async () => {},
  deleteTeam: async () => {},
  addDay: async () => null,
  updateDay: async () => {},
  deleteDay: async () => {},
  addMatch: async () => null,
  updateMatch: async () => {},
  deleteMatch: async () => {},
  updateMatchResults: async () => {}
};

export const TournamentContext = createContext<TournamentContextType>(defaultContext);

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load tournaments when user changes
  useEffect(() => {
    if (user) {
      fetchTournaments();
    } else {
      // Clear data when logged out
      setTournaments([]);
      setCurrentTournament(null);
      setLoading(false);
    }
  }, [user]);

  const fetchTournaments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: tournamentsData, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // For each tournament, fetch related teams and days
      const populatedTournaments = await Promise.all(
        tournamentsData.map(async (tournament) => {
          // Fetch teams for this tournament
          const { data: teamsData, error: teamsError } = await supabase
            .from('teams')
            .select('*')
            .eq('tournament_id', tournament.id);
            
          if (teamsError) throw teamsError;
          
          // Fetch days for this tournament
          const { data: daysData, error: daysError } = await supabase
            .from('days')
            .select('*')
            .eq('tournament_id', tournament.id)
            .order('created_at', { ascending: true });
            
          if (daysError) throw daysError;
          
          // For each day, fetch matches
          const populatedDays = await Promise.all(
            daysData.map(async (day) => {
              const { data: matchesData, error: matchesError } = await supabase
                .from('matches')
                .select('*')
                .eq('day_id', day.id)
                .order('created_at', { ascending: true });
                
              if (matchesError) throw matchesError;
              
              // For each match, fetch results
              const populatedMatches = await Promise.all(
                matchesData.map(async (match) => {
                  const { data: resultsData, error: resultsError } = await supabase
                    .from('match_results')
                    .select('*')
                    .eq('match_id', match.id);
                    
                  if (resultsError) throw resultsError;
                  
                  return {
                    id: match.id,
                    name: match.name,
                    dayId: match.day_id,
                    tournamentId: match.tournament_id,
                    results: resultsData.map(result => ({
                      teamId: result.team_id,
                      placement: result.placement,
                      kills: result.kills,
                      placementPoints: result.placement_points,
                      killPoints: result.kill_points,
                      totalPoints: result.total_points
                    }))
                  };
                })
              );
              
              return {
                id: day.id,
                name: day.name,
                tournamentId: day.tournament_id,
                matches: populatedMatches
              };
            })
          );
          
          // Map teams to our app's format
          const mappedTeams = teamsData.map(team => ({
            id: team.id,
            name: team.name,
            logo: team.logo || undefined,
            flag: team.flag || undefined,
            players: [] // We'll fetch players separately if needed
          }));
          
          // Return complete tournament
          return {
            id: tournament.id,
            name: tournament.name,
            description: tournament.description || undefined,
            days: populatedDays,
            teams: mappedTeams
          };
        })
      );
      
      setTournaments(populatedTournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast({
        title: "Failed to load tournaments",
        description: "There was an error loading your tournaments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Tournament operations
  const createTournament = async (name: string, description?: string): Promise<Tournament | null> => {
    if (!user) return null;
    
    try {
      const tournamentId = uuidv4();
      
      // Insert tournament into Supabase
      const { error } = await supabase.from('tournaments').insert({
        id: tournamentId,
        name,
        description,
        user_id: user.id
      });
      
      if (error) throw error;
      
      // Create new tournament object
      const newTournament: Tournament = {
        id: tournamentId,
        name,
        description,
        days: [],
        teams: []
      };
      
      // Update local state
      setTournaments(prev => [newTournament, ...prev]);
      setCurrentTournament(newTournament);
      
      toast({
        title: "Tournament created",
        description: `"${name}" has been created successfully.`,
      });
      
      return newTournament;
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast({
        title: "Failed to create tournament",
        description: "There was an error creating your tournament. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTournament = async (tournament: Tournament) => {
    if (!user) return;
    
    try {
      // Update tournament in Supabase
      const { error } = await supabase
        .from('tournaments')
        .update({
          name: tournament.name,
          description: tournament.description
        })
        .eq('id', tournament.id);
      
      if (error) throw error;
      
      // Update local state
      setTournaments(prev => 
        prev.map(t => t.id === tournament.id ? tournament : t)
      );
      
      if (currentTournament?.id === tournament.id) {
        setCurrentTournament(tournament);
      }
      
      toast({
        title: "Tournament updated",
        description: `"${tournament.name}" has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating tournament:', error);
      toast({
        title: "Failed to update tournament",
        description: "There was an error updating your tournament. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTournament = async (id: string) => {
    if (!user) return;
    
    try {
      // Delete tournament from Supabase
      // Note: All related records will be deleted automatically due to ON DELETE CASCADE
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTournaments(prev => prev.filter(t => t.id !== id));
      
      if (currentTournament?.id === id) {
        setCurrentTournament(null);
      }
      
      toast({
        title: "Tournament deleted",
        description: "The tournament has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting tournament:', error);
      toast({
        title: "Failed to delete tournament",
        description: "There was an error deleting your tournament. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectTournament = async (id: string) => {
    const tournament = tournaments.find(t => t.id === id) || null;
    setCurrentTournament(tournament);
  };

  // Team operations
  const addTeam = async (name: string, flag?: string, logo?: string): Promise<Team | null> => {
    if (!user || !currentTournament) return null;
    
    try {
      const teamId = uuidv4();
      
      // Insert team into Supabase
      const { error } = await supabase.from('teams').insert({
        id: teamId,
        name,
        flag,
        logo,
        tournament_id: currentTournament.id
      });
      
      if (error) throw error;
      
      // Create new team object
      const newTeam: Team = {
        id: teamId,
        name,
        flag,
        logo,
        players: []
      };
      
      // Update local state
      const updatedTournament = {
        ...currentTournament,
        teams: [...currentTournament.teams, newTeam]
      };
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Team added",
        description: `"${name}" has been added successfully.`,
      });
      
      return newTeam;
    } catch (error) {
      console.error('Error adding team:', error);
      toast({
        title: "Failed to add team",
        description: "There was an error adding the team. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTeam = async (team: Team) => {
    if (!user || !currentTournament) return;
    
    try {
      // Update team in Supabase
      const { error } = await supabase
        .from('teams')
        .update({
          name: team.name,
          flag: team.flag,
          logo: team.logo
        })
        .eq('id', team.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedTournament = {
        ...currentTournament,
        teams: currentTournament.teams.map(t => t.id === team.id ? team : t)
      };
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Team updated",
        description: `"${team.name}" has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        title: "Failed to update team",
        description: "There was an error updating the team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTeam = async (id: string) => {
    if (!user || !currentTournament) return;
    
    try {
      // Delete team from Supabase
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const updatedTournament = {
        ...currentTournament,
        teams: currentTournament.teams.filter(t => t.id !== id)
      };
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Failed to delete team",
        description: "There was an error deleting the team. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Day operations
  const addDay = async (name: string): Promise<Day | null> => {
    if (!user || !currentTournament) return null;
    
    try {
      const dayId = uuidv4();
      
      // Insert day into Supabase
      const { error } = await supabase.from('days').insert({
        id: dayId,
        name,
        tournament_id: currentTournament.id
      });
      
      if (error) throw error;
      
      // Create new day object
      const newDay: Day = {
        id: dayId,
        name,
        tournamentId: currentTournament.id,
        matches: []
      };
      
      // Update local state
      const updatedTournament = {
        ...currentTournament,
        days: [...currentTournament.days, newDay]
      };
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Day added",
        description: `"${name}" has been added successfully.`,
      });
      
      return newDay;
    } catch (error) {
      console.error('Error adding day:', error);
      toast({
        title: "Failed to add day",
        description: "There was an error adding the day. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateDay = async (day: Day) => {
    if (!user || !currentTournament) return;
    
    try {
      // Update day in Supabase
      const { error } = await supabase
        .from('days')
        .update({
          name: day.name
        })
        .eq('id', day.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedTournament = {
        ...currentTournament,
        days: currentTournament.days.map(d => d.id === day.id ? day : d)
      };
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Day updated",
        description: `"${day.name}" has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating day:', error);
      toast({
        title: "Failed to update day",
        description: "There was an error updating the day. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteDay = async (id: string) => {
    if (!user || !currentTournament) return;
    
    try {
      // Delete day from Supabase
      const { error } = await supabase
        .from('days')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const updatedTournament = {
        ...currentTournament,
        days: currentTournament.days.filter(d => d.id !== id)
      };
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Day deleted",
        description: "The day has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting day:', error);
      toast({
        title: "Failed to delete day",
        description: "There was an error deleting the day. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Match operations
  const addMatch = async (name: string, dayId: string): Promise<Match | null> => {
    if (!user || !currentTournament) return null;
    
    try {
      const matchId = uuidv4();
      
      // Insert match into Supabase
      const { error } = await supabase.from('matches').insert({
        id: matchId,
        name,
        day_id: dayId,
        tournament_id: currentTournament.id
      });
      
      if (error) throw error;
      
      // Create new match object
      const newMatch: Match = {
        id: matchId,
        name,
        dayId,
        tournamentId: currentTournament.id,
        results: []
      };
      
      // Update local state
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
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Match added",
        description: `"${name}" has been added successfully.`,
      });
      
      return newMatch;
    } catch (error) {
      console.error('Error adding match:', error);
      toast({
        title: "Failed to add match",
        description: "There was an error adding the match. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateMatch = async (match: Match) => {
    if (!user || !currentTournament) return;
    
    try {
      // Update match in Supabase
      const { error } = await supabase
        .from('matches')
        .update({
          name: match.name,
          day_id: match.dayId
        })
        .eq('id', match.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedTournament = {
        ...currentTournament,
        days: currentTournament.days.map(day => {
          // If this is the day that contains the match
          if (day.id === match.dayId) {
            return {
              ...day,
              matches: day.matches.map(m => m.id === match.id ? match : m)
            };
          }
          // If the match was moved from this day to another day
          if (day.matches.some(m => m.id === match.id)) {
            return {
              ...day,
              matches: day.matches.filter(m => m.id !== match.id)
            };
          }
          return day;
        })
      };
      
      // If the match was moved to a day that didn't have it before, add it
      const hasMatch = updatedTournament.days.some(day => 
        day.id === match.dayId && day.matches.some(m => m.id === match.id)
      );
      
      if (!hasMatch) {
        const finalTournament = {
          ...updatedTournament,
          days: updatedTournament.days.map(day => {
            if (day.id === match.dayId) {
              return {
                ...day,
                matches: [...day.matches, match]
              };
            }
            return day;
          })
        };
        
        setCurrentTournament(finalTournament);
        setTournaments(prev => 
          prev.map(t => t.id === currentTournament.id ? finalTournament : t)
        );
      } else {
        setCurrentTournament(updatedTournament);
        setTournaments(prev => 
          prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
        );
      }
      
      toast({
        title: "Match updated",
        description: `"${match.name}" has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating match:', error);
      toast({
        title: "Failed to update match",
        description: "There was an error updating the match. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteMatch = async (id: string) => {
    if (!user || !currentTournament) return;
    
    try {
      // Delete match from Supabase
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const updatedTournament = {
        ...currentTournament,
        days: currentTournament.days.map(day => {
          if (day.matches.some(m => m.id === id)) {
            return {
              ...day,
              matches: day.matches.filter(m => m.id !== id)
            };
          }
          return day;
        })
      };
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Match deleted",
        description: "The match has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting match:', error);
      toast({
        title: "Failed to delete match",
        description: "There was an error deleting the match. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateMatchResults = async (matchId: string, results: MatchResult[]) => {
    if (!user || !currentTournament) return;
    
    try {
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
      
      // Delete existing results for this match
      const { error: deleteError } = await supabase
        .from('match_results')
        .delete()
        .eq('match_id', matchId);
        
      if (deleteError) throw deleteError;
      
      // Insert new results
      if (calculatedResults.length > 0) {
        const { error: insertError } = await supabase.from('match_results').insert(
          calculatedResults.map(result => ({
            match_id: matchId,
            team_id: result.teamId,
            placement: result.placement,
            kills: result.kills,
            placement_points: result.placementPoints,
            kill_points: result.killPoints,
            total_points: result.totalPoints
          }))
        );
        
        if (insertError) throw insertError;
      }
      
      // Update local state
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
      
      setCurrentTournament(updatedTournament);
      setTournaments(prev => 
        prev.map(t => t.id === currentTournament.id ? updatedTournament : t)
      );
      
      toast({
        title: "Results updated",
        description: "Match results have been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating match results:', error);
      toast({
        title: "Failed to update results",
        description: "There was an error updating the match results. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        currentTournament,
        loading,
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
