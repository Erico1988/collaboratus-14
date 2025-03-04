
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";

interface DashboardFiltersProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  department: string;
  onDateRangeChange: (dateRange: { from: Date | undefined; to: Date | undefined }) => void;
  onDepartmentChange: (department: string) => void;
}

export const DashboardFilters = ({
  dateRange,
  department,
  onDateRangeChange,
  onDepartmentChange,
}: DashboardFiltersProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to
  });

  // Create a list of fake departments
  const departments = [
    { id: "all", name: "Tous les départements" },
    { id: "it", name: "Informatique" },
    { id: "finance", name: "Finance" },
    { id: "hr", name: "Ressources Humaines" },
    { id: "sales", name: "Ventes" },
    { id: "legal", name: "Juridique" },
  ];

  // Handler to safely update date ranges
  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    
    // Only update the parent if we have valid dates
    if (selectedDate?.from) {
      onDateRangeChange({
        from: selectedDate.from,
        to: selectedDate.to || selectedDate.from // Ensure to is always set
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white/80 backdrop-blur-sm border rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Période</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd MMM yyyy", { locale: fr })} -{" "}
                    {format(date.to, "dd MMM yyyy", { locale: fr })}
                  </>
                ) : (
                  format(date.from, "dd MMM yyyy", { locale: fr })
                )
              ) : (
                <span>Sélectionner une période</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Département</label>
        <Select
          value={department}
          onValueChange={onDepartmentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un département" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
