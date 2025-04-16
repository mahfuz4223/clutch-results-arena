import React, { useState, useEffect } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Match, MatchResult, Team } from "@/types";
import { calculatePlacementPoints } from "@/utils/pointCalculator";
import { Save } from "lucide-react";

interface ResultsInputProps {
  matchId: string;
  match?: Match;
  teams?: Team[];
  onComplete?: () => void;
  onSave?: () => void;
}

const ResultsInput: React.FC<ResultsInputProps> = ({ matchId, match, teams, onComplete, onSave }) => {
  const { currentTournament, updateMatchResults } = useTournament();
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const tourTeams = teams || (currentTournament?.teams || []);
  const matchToUse = match || (currentTournament?.days
    .flatMap(day => day.matches)
    .find(m => m.id === matchId));

  useEffect(() => {
    if (matchToUse) {
      // If the match already has results, use them
      if (matchToUse.results && matchToUse.results.length > 0) {
        setResults(matchToUse.results);
      } else {
        // Otherwise initialize empty results for all teams
        const initialResults: MatchResult[] = tourTeams.map(team => ({
          teamId: team.id,
          placement: 0,
          kills: 0,
          placementPoints: 0,
          killPoints: 0,
          totalPoints: 0
        }));
        setResults(initialResults);
      }
      setIsDirty(false);
    }
  }, [matchToUse, tourTeams]);

  if (!matchToUse) {
    return <div>Match not found</div>;
  }

  const handlePlacementChange = (teamId: string, placement: number) => {
    setResults(prev => 
      prev.map(result => {
        if (result.teamId === teamId) {
          const placementPoints = calculatePlacementPoints(placement);
          const totalPoints = placementPoints + result.kills;
          return { 
            ...result, 
            placement, 
            placementPoints, 
            totalPoints 
          };
        }
        return result;
      })
    );
    setIsDirty(true);
  };

  const handleKillsChange = (teamId: string, kills: number) => {
    setResults(prev => 
      prev.map(result => {
        if (result.teamId === teamId) {
          const totalPoints = result.placementPoints + kills;
          return { 
            ...result, 
            kills, 
            killPoints: kills, 
            totalPoints 
          };
        }
        return result;
      })
    );
    setIsDirty(true);
  };

  const handleSave = () => {
    updateMatchResults(matchId, results);
    setIsDirty(false);
    if (onSave) onSave();
    if (onComplete) onComplete();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Enter Results: {matchToUse.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead className="w-28">Placement</TableHead>
              <TableHead className="w-28">Kills</TableHead>
              <TableHead className="text-right">Place Points</TableHead>
              <TableHead className="text-right">Kill Points</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => {
              const team = tourTeams.find(t => t.id === result.teamId);
              
              return (
                <TableRow key={result.teamId}>
                  <TableCell className="font-medium">
                    {team?.flag && <span className="mr-2">{team.flag}</span>}
                    {team?.name || "Unknown Team"}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      max={tourTeams.length}
                      value={result.placement || ""}
                      onChange={(e) => handlePlacementChange(result.teamId, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={result.kills || ""}
                      onChange={(e) => handleKillsChange(result.teamId, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell className="text-right">{result.placementPoints}</TableCell>
                  <TableCell className="text-right">{result.kills}</TableCell>
                  <TableCell className="text-right font-bold">{result.totalPoints}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={!isDirty}
            className="px-4 py-2"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsInput;
