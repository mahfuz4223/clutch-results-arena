
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import MatchForm from "@/components/matches/MatchForm";
import ResultsInput from "@/components/matches/ResultsInput";
import { ChevronLeft, Download, Plus, Trophy } from "lucide-react";

const MatchesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectTournament, currentTournament, addDay, addMatch, deleteMatch } = useTournament();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [showResultsForMatch, setShowResultsForMatch] = useState<string | null>(null);
  const [newDayName, setNewDayName] = useState<string>("");
  const [isAddingDay, setIsAddingDay] = useState(false);
  
  // Select tournament if not already selected
  React.useEffect(() => {
    if (id && (!currentTournament || currentTournament.id !== id)) {
      selectTournament(id);
    }
  }, [id, currentTournament, selectTournament]);

  // Set first day as selected if there's no selection and tournament has days
  React.useEffect(() => {
    if (
      currentTournament && 
      currentTournament.days.length > 0 && 
      (!selectedDayId || !currentTournament.days.find(day => day.id === selectedDayId))
    ) {
      setSelectedDayId(currentTournament.days[0].id);
    }
  }, [currentTournament, selectedDayId]);

  const selectedDay = currentTournament?.days.find(day => day.id === selectedDayId);
  
  // Reset results editing when day changes
  React.useEffect(() => {
    if (selectedDayId) {
      setShowResultsForMatch(null);
    }
  }, [currentTournament, selectedDayId]);

  const handleAddDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDayName.trim()) {
      setIsAddingDay(true);
      try {
        const day = await addDay(newDayName);
        if (day) {
          setSelectedDayId(day.id);
          setNewDayName("");
        }
      } catch (error) {
        console.error("Error adding day:", error);
      } finally {
        setIsAddingDay(false);
      }
    }
  };

  const handleDownloadSchedule = () => {
    if (!currentTournament) return;
    
    const dayMatches = currentTournament.days.map(day => {
      return {
        day: day.name,
        matches: day.matches.map(match => ({
          name: match.name
        }))
      };
    });
    
    const matchData = JSON.stringify(dayMatches, null, 2);
    const blob = new Blob([matchData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTournament.name.replace(/\s+/g, '_')}_schedule.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <h1 className="text-3xl font-bold">{currentTournament.name} Matches</h1>
              </div>
            </div>
            <p className="text-gray-500 mt-1">Manage tournament days and matches</p>
          </div>
          
          <Button variant="outline" onClick={handleDownloadSchedule} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Schedule
          </Button>
        </div>

        <Tabs defaultValue="days" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="days">Days & Matches</TabsTrigger>
            <TabsTrigger value="results">Input Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="days" className="space-y-6 mt-6">
            {/* Add Day Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Tournament Day</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDay} className="flex items-end gap-4">
                  <div className="flex-1">
                    <label htmlFor="dayName" className="block text-sm font-medium mb-2">
                      Day Name
                    </label>
                    <Input
                      id="dayName"
                      value={newDayName}
                      onChange={(e) => setNewDayName(e.target.value)}
                      placeholder="e.g., Day 1, Qualifiers, Finals"
                    />
                  </div>
                  <Button type="submit" disabled={isAddingDay || !newDayName.trim()}>
                    {isAddingDay ? "Adding..." : "Add Day"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Days and Matches List */}
            {currentTournament.days.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Tournament Days Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Create your first tournament day to start adding matches.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-3">Tournament Days</h3>
                        <div className="space-y-2">
                          {currentTournament.days.map(day => (
                            <Button
                              key={day.id}
                              variant={selectedDayId === day.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => setSelectedDayId(day.id)}
                            >
                              {day.name}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-3">
                    {selectedDay && (
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedDay.name} Matches</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <MatchForm dayId={selectedDay.id} onClose={() => {}} />
                          
                          <Separator />
                          
                          {selectedDay.matches.length === 0 ? (
                            <div className="text-center py-6">
                              <p className="text-gray-500 mb-4">No matches added for this day yet.</p>
                              <Button variant="outline" className="flex items-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Add your first match
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-medium mb-3">Matches List</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Match</TableHead>
                                    <TableHead>Results</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedDay.matches.map(match => (
                                    <TableRow key={match.id}>
                                      <TableCell className="font-medium">{match.name}</TableCell>
                                      <TableCell>
                                        {match.results && match.results.length > 0 ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Results Added
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            No Results
                                          </span>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => deleteMatch(match.id)}
                                        >
                                          Delete
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6 mt-6">
            {currentTournament.teams.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">You need to add teams before you can input results.</p>
                  <Link to={`/tournament/${currentTournament.id}/teams`}>
                    <Button>Add Teams</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : currentTournament.days.length === 0 || currentTournament.days.every(day => day.matches.length === 0) ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">You need to add matches before you can input results.</p>
                  <Button onClick={() => document.querySelector('button[value="days"]')?.click()}>
                    Add Matches
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Input Match Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {currentTournament.days.map(day => (
                      <AccordionItem key={day.id} value={day.id}>
                        <AccordionTrigger>{day.name}</AccordionTrigger>
                        <AccordionContent>
                          {day.matches.length === 0 ? (
                            <p className="text-gray-500 py-4">No matches for this day.</p>
                          ) : (
                            <div className="space-y-4">
                              {day.matches.map(match => (
                                <div key={match.id} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium">{match.name}</h4>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setShowResultsForMatch(
                                        showResultsForMatch === match.id ? null : match.id
                                      )}
                                    >
                                      {showResultsForMatch === match.id ? "Cancel" : "Input Results"}
                                    </Button>
                                  </div>
                                  
                                  {showResultsForMatch === match.id && (
                                    <ResultsInput
                                      matchId={match.id}
                                      teams={currentTournament.teams}
                                      onComplete={() => setShowResultsForMatch(null)}
                                    />
                                  )}
                                  
                                  {match.results && match.results.length > 0 && showResultsForMatch !== match.id && (
                                    <div>
                                      <h5 className="text-sm font-medium mb-2">Current Results:</h5>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Team</TableHead>
                                            <TableHead>Kills</TableHead>
                                            <TableHead>Points</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {[...match.results]
                                            .sort((a, b) => a.placement - b.placement)
                                            .map(result => {
                                              const team = currentTournament.teams.find(t => t.id === result.teamId);
                                              return (
                                                <TableRow key={result.teamId}>
                                                  <TableCell>#{result.placement}</TableCell>
                                                  <TableCell>{team?.name || "Unknown Team"}</TableCell>
                                                  <TableCell>{result.kills}</TableCell>
                                                  <TableCell>{result.totalPoints}</TableCell>
                                                </TableRow>
                                              );
                                            })}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MatchesPage;
