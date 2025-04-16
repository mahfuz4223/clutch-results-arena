
import React, { useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types";
import { X } from "lucide-react";

interface TeamFormProps {
  existingTeam?: Team;
  onClose: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ existingTeam, onClose }) => {
  const { addTeam, updateTeam } = useTournament();
  const [name, setName] = useState(existingTeam?.name || "");
  const [flag, setFlag] = useState(existingTeam?.flag || "");
  const [logo, setLogo] = useState(existingTeam?.logo || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Team name is required");
      return;
    }
    
    if (existingTeam) {
      updateTeam({
        ...existingTeam,
        name,
        flag,
        logo
      });
    } else {
      addTeam(name, flag, logo);
    }
    
    onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          {existingTeam ? "Edit Team" : "Add New Team"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Team Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Team Liquid"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="flag" className="block text-sm font-medium">
              Flag (emoji or country code)
            </label>
            <Input
              id="flag"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="🇺🇸 or US"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="logo" className="block text-sm font-medium">
              Team Logo URL (optional)
            </label>
            <Input
              id="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {existingTeam ? "Update Team" : "Add Team"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamForm;
