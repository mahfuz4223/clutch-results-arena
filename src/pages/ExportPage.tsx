
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft } from "lucide-react";
import ResultExport from "@/components/export/ResultExport";
import CustomizationPanel from "@/components/export/CustomizationPanel";
import { getThemeById } from "@/utils/themes";
import { CustomizationOptions } from "@/types";

const ExportPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectTournament, currentTournament } = useTournament();
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<"day" | "match">("day");
  const [customization, setCustomization] = useState<CustomizationOptions>({
    theme: "pubg-official",
    background: "dark-grid",
    customCss: "",
    cssPreset: "official",
    showSponsors: true,
    showGridLines: true,
    showTencentLogo: true,
    showPubgLogo: true,
    showTournamentLogo: true
  });
  
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

  // Handle customization changes
  const handleCustomizationChange = (newOptions: Partial<CustomizationOptions>) => {
    setCustomization(prev => ({ ...prev, ...newOptions }));
  };

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
              <h1 className="text-3xl font-bold">Tournament Results</h1>
            </div>
            <p className="text-gray-500">Export and share {currentTournament.name} results</p>
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
          <Card>
            <CardHeader>
              <CardTitle>PUBG Mobile Tournament Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultExport
                tournament={currentTournament.name}
                teams={currentTournament.teams}
                days={currentTournament.days}
                selectedDay={selectedDay}
                format={selectedFormat}
                selectedMatch={selectedMatch || undefined}
                customization={customization}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ExportPage;
