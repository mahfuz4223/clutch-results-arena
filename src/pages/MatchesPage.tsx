
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash, ChevronLeft, Table2, CalendarDays } from "lucide-react";
import { Day, Match } from "@/types";
import MatchForm from "@/components/matches/MatchForm";
import ResultsInput from "@/components/matches/ResultsInput";

const MatchesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectTournament, currentTournament, addDay, deleteDay, deleteMatch } = useTournament();
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [showResultsForMatch, setShowResultsForMatch] = useState<string | null>(null);
  const [newDayName, setNewDayName] = useState<string>("");
  
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

  // Set first day as selected by default if there are days
  React.useEffect(() => {
    if (currentTournament && currentTournament.days.length > 0 && !selectedDayId) {
      setSelectedDayId(currentTournament.days[0].id);
    }
  }, [currentTournament, selectedDayId]);

  const handleAddDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDayName.trim()) {
      const newDay = addDay(newDayName);
      setSelectedDayId(newDay.id);
      setNewDayName("");
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setIsAddMatchOpen(true);
  };

  const handleDeleteMatch = (matchId: string) => {
    if (confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      deleteMatch(matchId);
      if (showResultsForMatch === matchId) {
        setShowResultsForMatch(null);
      }
    }
  };

  const handleDeleteDay = (dayId: string) => {
    if (confirm("Are you sure you want to delete this day and all its matches? This action cannot be undone.")) {
      deleteDay(dayId);
      if (selectedDayId === dayId) {
        setSelectedDayId(currentTournament.days[0]?.id || null);
      }
    }
  };

  const closeMatchDialog = () => {
    setIsAddMatchOpen(false);
    setEditingMatch(undefined);
  };

  const closeResultsDialog = () => {
    setShowResultsForMatch(null);
  };

  const currentDay = currentTournament.days.find(day => day.id === selectedDayId);

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
              <h1 className="text-3xl font-bold">Matches</h1>
            </div>
            <p className="text-gray-500">Manage days and matches for {currentTournament.name}</p>
          </div>
        </div>

        <Tabs defaultValue="days" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="days" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Days
            </TabsTrigger>
            <TabsTrigger value="allMatches" className="flex items-center">
              <Table2 className="h-4 w-4 mr-2" />
              All Matches
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="days" className="space-y-6">
            {/* Days List and Add Day Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Days</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentTournament.days.length === 0 ? (
                      <p className="text-sm text-gray-500">No days added yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {currentTournament.days.map((day) => (
                          <div 
                            key={day.id} 
                            className={`
                              p-3 rounded-md cursor-pointer flex justify-between items-center
                              ${selectedDayId === day.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}
                            `}
                            onClick={() => setSelectedDayId(day.id)}
                          >
                            <div className="font-medium">{day.name}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDay(day.id);
                              }}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <form onSubmit={handleAddDay} className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={newDayName}
                          onChange={(e) => setNewDayName(e.target.value)}
                          placeholder="Day Name (e.g. Day 1)"
                          className="flex-1"
                        />
                        <Button type="submit" size="sm" disabled={!newDayName.trim()}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      {currentDay ? `Matches for ${currentDay.name}` : "No day selected"}
                    </CardTitle>
                    
                    {currentDay && (
                      <Dialog open={isAddMatchOpen} onOpenChange={setIsAddMatchOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            Add Match
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <MatchForm 
                            existingMatch={editingMatch} 
                            dayId={currentDay.id}
                            onClose={closeMatchDialog}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!currentDay ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          {currentTournament.days.length === 0 
                            ? "Add a day first to manage matches" 
                            : "Select a day to view matches"}
                        </p>
                      </div>
                    ) : currentDay.matches.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No matches added for this day yet.</p>
                        <Dialog open={isAddMatchOpen} onOpenChange={setIsAddMatchOpen}>
                          <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              Add Your First Match
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <MatchForm 
                              dayId={currentDay.id}
                              onClose={closeMatchDialog}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Match</TableHead>
                            <TableHead>Results Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentDay.matches.map((match) => (
                            <TableRow key={match.id}>
                              <TableCell className="font-medium">{match.name}</TableCell>
                              <TableCell>
                                {match.results && match.results.length > 0 ? (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Results Added
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                    No Results
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowResultsForMatch(match.id)}
                                  >
                                    Results
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditMatch(match)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteMatch(match.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="allMatches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Tournament Matches</CardTitle>
              </CardHeader>
              <CardContent>
                {currentTournament.days.length === 0 || 
                 currentTournament.days.every(day => day.matches.length === 0) ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No matches added to this tournament yet.</p>
                    <Link to={`/tournament/${currentTournament.id}/matches`}>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Your First Match
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Match</TableHead>
                        <TableHead>Results Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTournament.days.flatMap(day => 
                        day.matches.map(match => (
                          <TableRow key={match.id}>
                            <TableCell>{day.name}</TableCell>
                            <TableCell className="font-medium">{match.name}</TableCell>
                            <TableCell>
                              {match.results && match.results.length > 0 ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Results Added
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                  No Results
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowResultsForMatch(match.id)}
                                >
                                  Results
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDayId(day.id);
                                    handleEditMatch(match);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteMatch(match.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results Dialog */}
        {showResultsForMatch && (
          <Dialog open={!!showResultsForMatch} onOpenChange={() => setShowResultsForMatch(null)}>
            <DialogContent className="max-w-3xl">
              <ResultsInput 
                matchId={showResultsForMatch} 
                onSave={closeResultsDialog}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default MatchesPage;
