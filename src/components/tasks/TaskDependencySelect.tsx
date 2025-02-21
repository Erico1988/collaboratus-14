
import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Simulation de données, à remplacer par des données réelles
const mockTasks = [
  { id: "3", title: "Tâche 3" },
  { id: "4", title: "Tâche 4" },
  { id: "5", title: "Tâche 5" },
];

interface TaskDependencySelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  currentTaskId?: string;
}

export const TaskDependencySelect = ({
  value,
  onChange,
  currentTaskId,
}: TaskDependencySelectProps) => {
  const [open, setOpen] = useState(false);

  const tasks = mockTasks.filter(task => task.id !== currentTaskId);
  const selectedTasks = tasks.filter(task => value.includes(task.id));

  const toggleTask = (taskId: string) => {
    const newValue = value.includes(taskId)
      ? value.filter(id => id !== taskId)
      : [...value, taskId];
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Sélectionner des tâches
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Rechercher une tâche..." />
            <CommandEmpty>Aucune tâche trouvée.</CommandEmpty>
            <CommandGroup>
              {tasks.map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => toggleTask(task.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(task.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {task.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTasks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTasks.map((task) => (
            <Badge
              key={task.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleTask(task.id)}
            >
              {task.title}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
