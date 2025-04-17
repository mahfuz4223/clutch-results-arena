
import React, { useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Match } from "@/types";

interface MatchFormProps {
  existingMatch?: Match;
  dayId?: string;
  onClose: () => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ existingMatch, dayId, onClose }) => {
  const { currentTournament, addMatch, updateMatch } = useTournament();
  const [name, setName] = useState(existingMatch?.name || "");
  const [selectedDayId, setSelectedDayId] = useState(dayId || existingMatch?.dayId || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedDayId) return;

    setLoading(true);
    try {
      if (existingMatch) {
        await updateMatch({ ...existingMatch, name, dayId: selectedDayId });
      } else {
        await addMatch(name, selectedDayId);
      }
      onClose();
    } catch (error) {
      console.error("Error saving match:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentTournament) {
    return <div>No tournament selected</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="matchName">Match Name</Label>
        <Input
          id="matchName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter match name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="daySelect">Day</Label>
        <Select
          value={selectedDayId}
          onValueChange={setSelectedDayId}
        >
          <SelectTrigger id="daySelect">
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
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !name.trim() || !selectedDayId}
        >
          {loading ? "Saving..." : existingMatch ? "Update Match" : "Add Match"}
        </Button>
      </div>
    </form>
  );
};

export default MatchForm;
