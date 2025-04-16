
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Upload, Image } from "lucide-react";

const TournamentForm: React.FC = () => {
  const navigate = useNavigate();
  const { createTournament } = useTournament();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Tournament name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use await to wait for the Promise to resolve
      const tournament = await createTournament(name, description, logoUrl); 
      navigate(`/tournament/${tournament.id}`);
    } catch (err) {
      console.error("Error creating tournament:", err);
      setError("Failed to create tournament. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col items-center">
        <div className="flex items-center mb-4">
          <img 
            src="/public/lovable-uploads/208256eb-7194-493e-b6f2-1bb74a96f28d.png" 
            alt="PUBG Mobile" 
            className="h-12 mr-2" 
          />
          <Trophy className="h-8 w-8 text-primary mr-2" />
        </div>
        <CardTitle className="text-2xl">Create New Tournament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Tournament Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="2025 PMCO Spring Split"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tournament details, dates, prize pool, etc."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="logo" className="block text-sm font-medium">
              Tournament Logo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {logoUrl ? (
                  <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                    <img src={logoUrl} alt="Tournament logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-md border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <Image className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
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
                    onChange={handleLogoSelection}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Tournament"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TournamentForm;
