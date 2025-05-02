
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, Settings, Eye } from "lucide-react";
import ResultExport from "@/components/export/ResultExport";
import { getThemeById } from "@/utils/themes";
import { CustomizationOptions } from "@/types";
import CustomizationPanel from "@/components/export/CustomizationPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExportPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectTournament, currentTournament } = useTournament();
  const [selectedDay, setSelectedDay] = useState<string>("all");
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
    showTournamentLogo: true,
    footerText: "© 2025 TournaNext",
    logoUrl: "",
  });
  
  // Select tournament if not already selected
  React.useEffect(() => {
    if (id && (!currentTournament || currentTournament.id !== id)) {
      selectTournament(id);
    }
  }, [id, currentTournament, selectTournament]);

  const handleCustomizationChange = (changes: Partial<CustomizationOptions>) => {
    setCustomization(prev => ({ ...prev, ...changes }));
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
          <>
            <Card className="shadow-lg border border-gray-100">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl">Tournament Results Export</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 px-0 sm:px-6">
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="w-full max-w-md mx-auto mb-6">
                    <TabsTrigger value="preview" className="flex items-center gap-2 w-1/2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="customize" className="flex items-center gap-2 w-1/2">
                      <Settings className="h-4 w-4" />
                      Customize
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preview" className="mt-0">
                    <ResultExport
                      tournament={currentTournament.name}
                      teams={currentTournament.teams}
                      days={currentTournament.days}
                      selectedDay={selectedDay}
                      format={selectedFormat}
                      customization={customization}
                    />
                  </TabsContent>
                  
                  <TabsContent value="customize" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <CustomizationPanel options={customization} onChange={handleCustomizationChange} />
                      
                      <div className="lg:col-span-2 p-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Preview</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0 overflow-auto flex justify-center">
                            <ResultExport
                              tournament={currentTournament.name}
                              teams={currentTournament.teams}
                              days={currentTournament.days}
                              selectedDay={selectedDay}
                              format={selectedFormat}
                              customization={customization}
                              previewMode={true}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ExportPage;
