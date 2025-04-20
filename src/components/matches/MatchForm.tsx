
import React, { useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Match, Day } from "@/types";
import { X } from "lucide-react";

interface MatchFormProps {
  existingMatch?: Match;
  dayId?: string;
  onClose: () => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ existingMatch, dayId: initialDayId, onClose }) => {
  const { currentTournament, addMatch, updateMatch } = useTournament();
  const [name, setName] = useState(existingMatch?.name || "");
  const [dayId, setDayId] = useState(initialDayId || existingMatch?.dayId || "");
  const [error, setError] = useState("");

  if (!currentTournament) {
    return <div>No tournament selected</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Match name is required");
      return;
    }
    
    if (!dayId) {
      setError("Day is required");
      return;
    }
    
    if (existingMatch) {
      updateMatch({
        ...existingMatch,
        name,
        dayId
      });
    } else {
      addMatch(name, dayId);
    }
    
    onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          {existingMatch ? "Edit Match" : "Add New Match"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Match Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Match 1"
              required
            />
            {error && name.trim() === "" && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="day" className="block text-sm font-medium">
              Day
            </label>
            <Select value={dayId} onValueChange={setDayId}>
              <SelectTrigger id="day">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {currentTournament.days.map((day) => (
                  <SelectItem key={day.id} value={day.id}>
                    {day.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && !dayId && <p className="text-sm text-red-500">{error}</p>}
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
              {existingMatch ? "Update Match" : "Add Match"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MatchForm;
