import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Download, Trophy, Image, Upload, Code } from "lucide-react";
import ResultCard from "@/components/export/ResultCard";
import { getThemeById, THEME_OPTIONS } from "@/utils/themes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const PRESET_BACKGROUNDS = [
  { 
    id: "parachute", 
    name: "Parachuting", 
    url: "/lovable-uploads/e7add741-4852-48db-89bb-52c3dd8d4a1a.png" 
  },
  { 
    id: "pubg-logo", 
    name: "PUBG Logo", 
    url: "/lovable-uploads/df7669b7-5636-40c7-9273-9aecbd65db00.png" 
  },
  { 
    id: "erangel", 
    name: "Erangel Map", 
    url: "/lovable-uploads/6596d994-4323-45a5-9ad1-f195654e5e6f.png" 
  },
  { 
    id: "battlegrounds", 
    name: "Battlegrounds", 
    url: "/lovable-uploads/effd7055-1750-4d73-97f0-70d8c6fd59e8.png" 
  },
  { 
    id: "player", 
    name: "PUBG Player", 
    url: "/lovable-uploads/e7482a5f-845f-4813-86b5-8bf37a3874b9.png" 
  },
  { 
    id: "blue-gradient", 
    name: "Blue Gradient", 
    url: "/lovable-uploads/e87b074a-5638-44a9-89b8-c7a619fc5af7.png" 
  },
  { 
    id: "none", 
    name: "No Background", 
    url: "" 
  }
];

const ExportPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectTournament, currentTournament } = useTournament();
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<"day" | "match">("day");
  const [selectedTheme, setSelectedTheme] = useState("pubg-blue");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [backgroundUrl, setBackgroundUrl] = useState<string>(PRESET_BACKGROUNDS[0].url);
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(20);
  const [showPubgLogo, setShowPubgLogo] = useState(true);
  const [customFooterText, setCustomFooterText] = useState("Generated with TournaNext");
  const [customCss, setCustomCss] = useState("");

  React.useEffect(() => {
    if (id && (!currentTournament || currentTournament.id !== id)) {
      selectTournament(id);
    }
  }, [id, currentTournament, selectTournament]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoUrl(reader.result);
          toast.success("Logo uploaded successfully");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBackgroundUrl(reader.result);
          toast.success("Background uploaded successfully");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundOpacityChange = (value: number[]) => {
    setBackgroundOpacity(value[0]);
  };
  
  const handleSelectPresetBackground = (url: string) => {
    setBackgroundUrl(url);
  };

  const exportResults = () => {
    if (!currentTournament) return;
    
    try {
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
      
      toast.success("Results exported successfully!");
    } catch (error) {
      console.error("Error exporting results:", error);
      toast.error("Failed to export results");
    }
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
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/208256eb-7194-493e-b6f2-1bb74a96f28d.png" 
                  alt="PUBG Mobile" 
                  className="h-8 mr-2" 
                />
                <h1 className="text-3xl font-bold">Export Results</h1>
              </div>
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
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-6">
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
                  </TabsContent>
                  
                  <TabsContent value="images" className="space-y-6">
                    <div className="space-y-3">
                      <Label>Tournament Logo</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {logoUrl ? (
                            <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                              <img src={logoUrl} alt="Tournament logo" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                              <Image className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="relative">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full flex items-center"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Logo
                            </Button>
                            <input
                              id="logo-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleLogoUpload}
                            />
                          </div>
                          {logoUrl && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-red-500 hover:text-red-700"
                              onClick={() => setLogoUrl("")}
                            >
                              Remove Logo
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Background Image</Label>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {PRESET_BACKGROUNDS.map(bg => (
                          <div 
                            key={bg.id}
                            className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                              backgroundUrl === bg.url ? 'border-blue-500' : 'border-transparent'
                            }`}
                            onClick={() => handleSelectPresetBackground(bg.url)}
                          >
                            {bg.url ? (
                              <div className="aspect-video w-full">
                                <img 
                                  src={bg.url} 
                                  alt={bg.name} 
                                  className="object-cover w-full h-full" 
                                />
                              </div>
                            ) : (
                              <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-500">None</span>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                              <p className="text-xs text-white truncate text-center">{bg.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {backgroundUrl ? (
                            <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                              <img src={backgroundUrl} alt="Background" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                              <Image className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="relative">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full flex items-center"
                              onClick={() => document.getElementById('bg-upload')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Custom Background
                            </Button>
                            <input
                              id="bg-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleBackgroundUpload}
                            />
                          </div>
                          {backgroundUrl && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-red-500 hover:text-red-700"
                              onClick={() => setBackgroundUrl("")}
                            >
                              Remove Background
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {backgroundUrl && (
                        <div className="pt-2">
                          <Label className="mb-2 block">Background Opacity: {backgroundOpacity}%</Label>
                          <Slider 
                            value={[backgroundOpacity]} 
                            onValueChange={handleBackgroundOpacityChange} 
                            min={0} 
                            max={100} 
                            step={5}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-pubg-logo"
                          checked={showPubgLogo}
                          onCheckedChange={(checked) => setShowPubgLogo(checked as boolean)}
                        />
                        <Label htmlFor="show-pubg-logo">Show PUBG Mobile Logo</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footer-text">Custom Footer Text</Label>
                      <Input
                        id="footer-text"
                        placeholder="Generated with TournaNext"
                        value={customFooterText}
                        onChange={(e) => setCustomFooterText(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-css">Custom CSS (Advanced)</Label>
                      <Textarea
                        id="custom-css"
                        placeholder=".className { color: red; }"
                        value={customCss}
                        onChange={(e) => setCustomCss(e.target.value)}
                        rows={5}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">Add custom CSS to style your export results</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

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
                      tournamentLogo={logoUrl || undefined}
                      backgroundImage={backgroundUrl || undefined}
                      customCss={customCss}
                      showPubgLogo={showPubgLogo}
                      customFooterText={customFooterText}
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
