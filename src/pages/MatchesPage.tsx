
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DayForm from "@/components/days/DayForm";
import MatchForm from "@/components/matches/MatchForm";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ChevronLeft, Plus, GripVertical, Edit, Trash2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Input } from "@/components/ui/input";

const MatchesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectTournament, currentTournament, addDay, updateDay, deleteDay, addMatch, updateMatch, deleteMatch, reorderDays, reorderMatches } = useTournament();
  const [openDayForm, setOpenDayForm] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [openMatchForm, setOpenMatchForm] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Select tournament if not already selected
  React.useEffect(() => {
    if (id && (!currentTournament || currentTournament.id !== id)) {
      selectTournament(id);
    }
  }, [id, currentTournament, selectTournament]);

  const handleDragEndDay = (result: any) => {
    if (!result.destination) {
      return;
    }

    reorderDays(result.source.index, result.destination.index);
  };

  const handleDragEndMatch = (dayId: string) => (result: any) => {
    if (!result.destination) {
      return;
    }

    reorderMatches(dayId, result.source.index, result.destination.index);
  };

  // Function to export schedule as JSON
  const exportSchedule = () => {
    if (!currentTournament) return;
    
    const data = {
      tournamentName: currentTournament.name,
      tournamentId: currentTournament.id,
      days: currentTournament.days.map(day => ({
        id: day.id,
        name: day.name,
        matches: day.matches.map(match => ({
          id: match.id,
          name: match.name
        }))
      }))
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTournament.name.replace(/\s+/g, '-').toLowerCase()}-schedule.json`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
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

  const filteredDays = currentTournament.days.filter(day =>
    day.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  src="/public/lovable-uploads/208256eb-7194-493e-b6f2-1bb74a96f28d.png" 
                  alt="PUBG Mobile" 
                  className="h-8 mr-2" 
                />
                <h1 className="text-3xl font-bold">Matches</h1>
              </div>
            </div>
            <p className="text-gray-500">Manage days and matches for {currentTournament.name}</p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={exportSchedule}
            >
              <Download className="h-4 w-4" />
              Export Schedule
            </Button>
            
            <Command>
              <CommandTrigger>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Day
                </Button>
              </CommandTrigger>
              <CommandContent>
                <CommandHeader>
                  <CommandTitle>Add Day</CommandTitle>
                  <CommandDescription>Create a new day for the tournament</CommandDescription>
                </CommandHeader>
                <CommandInput placeholder="Type to filter days..." />
                <CommandList>
                  <CommandEmpty>No day found.</CommandEmpty>
                  <CommandItem onSelect={() => setOpenDayForm(true)}>
                    New Day
                  </CommandItem>
                </CommandList>
              </CommandContent>
            </Command>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Days</CardTitle>
          </CardHeader>
          <CardContent>
            {currentTournament.days.length === 0 ? (
              <p className="text-gray-500">No days added yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative">
                    <Input
                      placeholder="Search days..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm focus-visible:outline-none"
                    />
                  </div>
                </div>
                
                <DragDropContext onDragEnd={handleDragEndDay}>
                  <Droppable droppableId="days">
                    {(provided) => (
                      <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {filteredDays.map((day, index) => (
                          <Draggable key={day.id} draggableId={day.id} index={index}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="bg-gray-50 rounded-md p-4 shadow-sm border border-gray-200 flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-5 w-5 mr-2 text-gray-400 cursor-grab" />
                                  </div>
                                  <span className="font-medium">{day.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDayId(day.id);
                                      setOpenDayForm(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteDay(day.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </CardContent>
        </Card>

        {currentTournament.days.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentTournament.days.map(day => (
                  <div key={day.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{day.name} Matches</h3>
                      <Button onClick={() => {
                        setSelectedDayId(day.id);
                        setOpenMatchForm(true);
                      }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Match
                      </Button>
                    </div>
                    
                    {day.matches.length === 0 ? (
                      <p className="text-gray-500">No matches added for {day.name} yet.</p>
                    ) : (
                      <DragDropContext onDragEnd={handleDragEndMatch(day.id)}>
                        <Droppable droppableId={`matches-${day.id}`}>
                          {(provided) => (
                            <ul
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {day.matches.map((match, index) => (
                                <Draggable key={match.id} draggableId={match.id} index={index}>
                                  {(provided) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="bg-gray-50 rounded-md p-4 shadow-sm border border-gray-200 flex items-center justify-between"
                                    >
                                      <div className="flex items-center">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="h-5 w-5 mr-2 text-gray-400 cursor-grab" />
                                        </div>
                                        <span className="font-medium">{match.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedMatchId(match.id);
                                            setSelectedDayId(day.id);
                                            setOpenMatchForm(true);
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteMatch(match.id)}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
                                    </li>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={openDayForm} onOpenChange={setOpenDayForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDayId ? "Edit Day" : "Add New Day"}</DialogTitle>
            <DialogDescription>
              {selectedDayId ? "Update the day's information." : "Create a new day for the tournament."}
            </DialogDescription>
          </DialogHeader>
          <DayForm 
            existingDay={selectedDayId ? currentTournament.days.find(day => day.id === selectedDayId) : undefined}
            onClose={() => {
              setOpenDayForm(false);
              setSelectedDayId(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openMatchForm} onOpenChange={setOpenMatchForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMatchId ? "Edit Match" : "Add New Match"}</DialogTitle>
            <DialogDescription>
              {selectedMatchId ? "Update the match's information." : "Create a new match for a specific day."}
            </DialogDescription>
          </DialogHeader>
          <MatchForm
            existingMatch={selectedMatchId ? currentTournament.days.flatMap(day => day.matches).find(match => match.id === selectedMatchId) : undefined}
            dayId={selectedDayId || undefined}
            onClose={() => {
              setOpenMatchForm(false);
              setSelectedMatchId(null);
              setSelectedDayId(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

interface CommandContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandContent = React.forwardRef<HTMLDivElement, CommandContentProps>(
  ({ className, ...props }, ref) => (
    <div className="z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0" ref={ref} {...props} />
  )
);
CommandContent.displayName = "CommandContent"

interface CommandHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandHeader = React.forwardRef<HTMLDivElement, CommandHeaderProps>(
  ({ className, ...props }, ref) => (
    <div className="flex flex-col px-2 py-1.5 text-sm" ref={ref} {...props} />
  )
);
CommandHeader.displayName = "CommandHeader"

interface CommandTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CommandTitle = React.forwardRef<HTMLHeadingElement, CommandTitleProps>(
  ({ className, ...props }, ref) => (
    <h1 className="mb-1.5 mt-2 px-2 text-lg font-semibold" ref={ref} {...props} />
  )
);
CommandTitle.displayName = "CommandTitle"

interface CommandDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CommandDescription = React.forwardRef<HTMLParagraphElement, CommandDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p className="px-2 text-muted-foreground text-sm" ref={ref} {...props} />
  )
);
CommandDescription.displayName = "CommandDescription"

interface CommandTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CommandTrigger = React.forwardRef<HTMLButtonElement, CommandTriggerProps>(
  ({ className, ...props }, ref) => (
    <Button variant="outline" size="sm" className="w-[200px] justify-start" ref={ref} {...props} />
  )
);
CommandTrigger.displayName = "CommandTrigger"

export default MatchesPage;
