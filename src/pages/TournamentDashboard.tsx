
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, CalendarDays, BarChart3, Download, Settings, Plus } from "lucide-react";
import { calculateOverallStandings } from "@/utils/pointCalculator";

const TournamentDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const { tournaments, selectTournament, currentTournament } = useTournament();
  
  // Select tournament if not already selected
  React.useEffect(() => {
    if (id && (!currentTournament || currentTournament.id !== id)) {
      selectTournament(id);
    }
  }, [id, currentTournament, selectTournament]);

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

  const tournamentStats = {
    daysCount: currentTournament.days.length,
    matchesCount: currentTournament.days.reduce((count, day) => count + day.matches.length, 0),
    teamsCount: currentTournament.teams.length,
    matchesWithResults: currentTournament.days
      .flatMap(day => day.matches)
      .filter(match => match.results && match.results.length > 0)
      .length
  };

  const allMatches = currentTournament.days.flatMap(day => day.matches);
  const standings = calculateOverallStandings(currentTournament.teams, allMatches);
  const top3Teams = standings.slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{currentTournament.name}</h1>
            <p className="text-gray-500">{currentTournament.description || "Tournament dashboard"}</p>
          </div>
          <Link to={`/tournament/${currentTournament.id}/settings`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{tournamentStats.teamsCount}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-green-500 mr-2" />
                <div className="text-2xl font-bold">{tournamentStats.daysCount}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                <div className="text-2xl font-bold">{tournamentStats.matchesCount}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Results Recorded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Download className="h-5 w-5 text-orange-500 mr-2" />
                <div className="text-2xl font-bold">{tournamentStats.matchesWithResults}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to={`/tournament/${currentTournament.id}/teams`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Manage Teams
                </CardTitle>
                <CardDescription>Add, edit or remove teams</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  You have {tournamentStats.teamsCount} teams in this tournament
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to={`/tournament/${currentTournament.id}/matches`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Manage Matches
                </CardTitle>
                <CardDescription>Create days and matches</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {tournamentStats.matchesCount} matches across {tournamentStats.daysCount} days
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to={`/tournament/${currentTournament.id}/results`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Results
                </CardTitle>
                <CardDescription>See tournament standings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {tournamentStats.matchesWithResults} out of {tournamentStats.matchesCount} matches have results
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Current Standings */}
        {top3Teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Current Top Teams</CardTitle>
              <CardDescription>Overall tournament standings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3Teams.map((team, index) => (
                  <Card key={team.teamId} className={`
                    ${index === 0 ? 'bg-yellow-50 border-yellow-200' : ''}
                    ${index === 1 ? 'bg-gray-50 border-gray-200' : ''}
                    ${index === 2 ? 'bg-amber-50 border-amber-200' : ''}
                  `}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${index === 0 ? 'bg-yellow-500 text-white' : ''}
                            ${index === 1 ? 'bg-gray-500 text-white' : ''}
                            ${index === 2 ? 'bg-amber-500 text-white' : ''}
                          `}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold">{team.teamName}</p>
                            <p className="text-sm text-gray-500">
                              {team.totalKills} kills, {team.wwcd} WWCD
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">{team.totalPoints}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 flex justify-center">
                <Link to={`/tournament/${currentTournament.id}/results`}>
                  <Button variant="outline">View Full Standings</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {tournamentStats.teamsCount === 0 && (
          <Card>
            <CardContent className="p-8 flex flex-col items-center">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Teams Added Yet</h3>
              <p className="text-gray-500 text-center mb-6">
                Start by adding teams to your tournament.
              </p>
              <Link to={`/tournament/${currentTournament.id}/teams`}>
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teams
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TournamentDashboard;
