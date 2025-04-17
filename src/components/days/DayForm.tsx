
import React, { useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Day } from "@/types";

interface DayFormProps {
  existingDay?: Day;
  onClose: () => void;
}

const DayForm: React.FC<DayFormProps> = ({ existingDay, onClose }) => {
  const { addDay, updateDay } = useTournament();
  const [name, setName] = useState(existingDay?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (existingDay) {
        await updateDay({ ...existingDay, name });
      } else {
        await addDay(name);
      }
      onClose();
    } catch (error) {
      console.error("Error saving day:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dayName">Day Name</Label>
        <Input
          id="dayName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter day name"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? "Saving..." : existingDay ? "Update Day" : "Add Day"}
        </Button>
      </div>
    </form>
  );
};

export default DayForm;
