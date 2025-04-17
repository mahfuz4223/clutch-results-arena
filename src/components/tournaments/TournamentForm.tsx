import React, { useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Tournament } from "@/types";

interface TournamentFormProps {
  existingTournament?: Tournament;
  onClose?: () => void;
}

const TournamentForm: React.FC<TournamentFormProps> = ({ existingTournament, onClose = () => {} }) => {
  const { createTournament, updateTournament } = useTournament();
  const [name, setName] = useState(existingTournament?.name || "");
  const [description, setDescription] = useState(existingTournament?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Tournament name is required");
      return;
    }
    
    if (existingTournament) {
      updateTournament({
        ...existingTournament,
        name,
        description
      });
    } else {
      createTournament(name, description);
    }
    
    onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          {existingTournament ? "Edit Tournament" : "Create New Tournament"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Tournament Name
            </label>
            <Input
              id="name"
              placeholder="Enter tournament name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {existingTournament ? "Update Tournament" : "Create Tournament"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TournamentForm;
