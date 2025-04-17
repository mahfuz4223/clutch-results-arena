
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OverallStandings from "@/components/results/OverallStandings";
import ResultsTable from "@/components/results/ResultsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, BarChart3, Download } from "lucide-react";
import { Day, Match, MatchResult, Team } from "@/types";

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectTournament, currentTournament } = useTournament();
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  
  // Select tournament if not already selected
  React.useEffect(() => {
    if (id && (!currentTournament || currentTournament.id !== id)) {
      selectTournament(id);
    }
  }, [id, currentTournament, selectTournament]);

  // Reset selected match when day changes
  React.useEffect(() => {
    setSelectedMatch(null);
  }, [selectedDay]);

  // Function to export results as JSON
  const exportResults = () => {
    if (!currentTournament) return;
    
    const data = {
      tournamentName: currentTournament.name,
      tournamentId: currentTournament.id,
      days: currentTournament.days.map(day => ({
        id: day.id,
        name: day.name,
        matches: day.matches.map(match => ({
          id: match.id,
          name: match.name,
          results: match.results
        }))
      })),
      teams: currentTournament.teams.map(team => ({
        id: team.id,
        name: team.name,
        flag: team.flag
      }))
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTournament.name.replace(/\s+/g, '-').toLowerCase()}-results.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentTournament) {
    return (
      <Layout>
        <Alert className="mb-6">
          <AlertDescription>
            Tournament not found. Please select a valid tournament.
          </AlertDescription>
        </Alert>
        <Link to="/tournaments">
          <Button>Back to Tournaments</Button>
        </Link>
      </Layout>
    );
  }

  const allMatches = currentTournament.days.flatMap(day => day.matches);
  const matchesForDay = selectedDay === "all" 
    ? allMatches 
    : currentTournament.days.find(day => day.id === selectedDay)?.matches || [];
  
  const currentMatch = selectedMatch 
    ? allMatches.find(match => match.id === selectedMatch) 
    : null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Link to={`/tournament/${currentTournament.id}`}>
                <Button variant="ghost" size="sm" className="rounded-full p-0 w-8 h-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center">
                <img 
                  src="/public/lovable-uploads/208256eb-7194-493e-b6f2-1bb74a96f28d.png" 
                  alt="PUBG Mobile" 
                  className="h-8 mr-2" 
                />
                <h1 className="text-3xl font-bold">Results</h1>
              </div>
            </div>
            <p className="text-gray-500">View standings for {currentTournament.name}</p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={exportResults}
            >
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            
            <Link to={`/tournament/${currentTournament.id}/export`}>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Export Graphics
              </Button>
            </Link>
          </div>
        </div>

        {currentTournament.teams.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">You need to add teams to view results.</p>
              <Link to={`/tournament/${currentTournament.id}/teams`}>
                <Button>Add Teams</Button>
              </Link>
            </CardContent>
          </Card>
        ) : allMatches.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">You need to add matches to view results.</p>
              <Link to={`/tournament/${currentTournament.id}/matches`}>
                <Button>Add Matches</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="font-medium">View Results For:</div>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Days</SelectItem>
                      {currentTournament.days.map(day => (
                        <SelectItem key={day.id} value={day.id}>
                          {day.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedDay !== "all" && (
                  <div className="flex items-center space-x-4">
                    <div className="font-medium">Match:</div>
                    <Select value={selectedMatch || "all"} onValueChange={setSelectedMatch}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Matches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Matches</SelectItem>
                        {matchesForDay.map(match => (
                          <SelectItem key={match.id} value={match.id}>
                            {match.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="standings" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="standings">Standings</TabsTrigger>
                <TabsTrigger value="matches">Match Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedDay === "all" 
                        ? "Overall Tournament Standings" 
                        : `Standings for ${currentTournament.days.find(d => d.id === selectedDay)?.name || ""}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OverallStandings 
                      teams={currentTournament.teams}
                      days={currentTournament.days}
                      selectedDay={selectedDay}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="matches" className="space-y-6">
                {currentMatch ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentMatch.name} Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {currentMatch.results && currentMatch.results.length > 0 ? (
                        <ResultsTable 
                          results={currentMatch.results}
                          teams={currentTournament.teams}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">No results have been recorded for this match.</p>
                          <Link to={`/tournament/${currentTournament.id}/matches`}>
                            <Button>Add Results</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {matchesForDay.filter(match => match.results && match.results.length > 0).length === 0 ? (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <p className="text-gray-500 mb-4">No results have been recorded for any matches in this day.</p>
                          <Link to={`/tournament/${currentTournament.id}/matches`}>
                            <Button>Add Results</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ) : (
                      matchesForDay.map(match => {
                        if (!match.results || match.results.length === 0) {
                          return null;
                        }
                        
                        return (
                          <Card key={match.id}>
                            <CardHeader>
                              <CardTitle>{match.name} Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResultsTable 
                                results={match.results}
                                teams={currentTournament.teams}
                              />
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ResultsPage;
