
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import ResultCard from "@/components/export/ResultCard";
import { getThemeById, THEME_OPTIONS } from "@/utils/themes";

const ExportPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectTournament, currentTournament } = useTournament();
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<"day" | "match">("day");
  const [selectedTheme, setSelectedTheme] = useState(THEME_OPTIONS[0].id);
  
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

  const allMatches = currentTournament.days.flatMap(day => day.matches);
  const dayMatches = selectedDay === "all" 
    ? allMatches 
    : currentTournament.days.find(day => day.id === selectedDay)?.matches || [];

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
              <h1 className="text-3xl font-bold">Export Results</h1>
            </div>
            <p className="text-gray-500">Export and download {currentTournament.name} results</p>
          </div>
        </div>

        {currentTournament.teams.length === 0 || allMatches.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                {currentTournament.teams.length === 0 
                  ? "You need to add teams to export results."
                  : "You need to add matches and input results to export."}
              </p>
              <Link to={
                currentTournament.teams.length === 0 
                  ? `/tournament/${currentTournament.id}/teams`
                  : `/tournament/${currentTournament.id}/matches`
              }>
                <Button>
                  {currentTournament.teams.length === 0 ? "Add Teams" : "Add Matches"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Options Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Format</Label>
                  <RadioGroup 
                    value={selectedFormat} 
                    onValueChange={(v) => setSelectedFormat(v as "day" | "match")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="day" id="day" />
                      <Label htmlFor="day">Day Results</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="match" id="match" />
                      <Label htmlFor="match">Single Match Results</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Data to Show</Label>
                  {selectedFormat === "day" ? (
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Days (Overall)</SelectItem>
                        {currentTournament.days.map(day => (
                          <SelectItem key={day.id} value={day.id}>
                            {day.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value={selectedMatch || ""} onValueChange={setSelectedMatch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Match" />
                      </SelectTrigger>
                      <SelectContent>
                        {allMatches.map(match => (
                          <SelectItem key={match.id} value={match.id}>
                            {currentTournament.days.find(d => d.id === match.dayId)?.name}: {match.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Theme</Label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {THEME_OPTIONS.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {(selectedFormat === "match" && !selectedMatch) ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Select a match to preview</p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <ResultCard
                      tournament={currentTournament.name}
                      teams={currentTournament.teams}
                      days={currentTournament.days}
                      selectedDay={selectedDay}
                      theme={getThemeById(selectedTheme)}
                      format={selectedFormat}
                      selectedMatch={selectedMatch || undefined}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExportPage;
