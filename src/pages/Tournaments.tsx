
import React from "react";
import { Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { Plus, Trophy, Calendar, Users, Trash, Edit } from "lucide-react";

const Tournaments = () => {
  const { tournaments, selectTournament, deleteTournament } = useTournament();

  const handleSelectTournament = (id: string) => {
    selectTournament(id);
  };

  const handleDeleteTournament = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this tournament? This action cannot be undone.")) {
      deleteTournament(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Tournaments</h1>
            <p className="text-gray-500">Manage your PUBG Mobile tournaments</p>
          </div>
          <Link to="/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Tournament
            </Button>
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Tournaments Yet</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                You haven't created any tournaments yet. Start by creating your first tournament.
              </p>
              <Link to="/create">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Tournament
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link 
                  to={`/tournament/${tournament.id}`} 
                  onClick={() => handleSelectTournament(tournament.id)}
                >
                  <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <CardTitle>{tournament.name}</CardTitle>
                    <CardDescription>
                      {tournament.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {tournament.days.length} {tournament.days.length === 1 ? "day" : "days"}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {tournament.teams.length} {tournament.teams.length === 1 ? "team" : "teams"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-gray-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectTournament(tournament.id);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => handleDeleteTournament(e, tournament.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tournaments;
