
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Send } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ScheduleDialogProps {
  trigger: React.ReactNode;
}

export const ScheduleDialog = ({ trigger }: ScheduleDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [frequency, setFrequency] = useState("once");
  const [emails, setEmails] = useState("");
  const [includeAttachment, setIncludeAttachment] = useState(true);
  
  const handleSchedule = () => {
    // Ici, vous implémenteriez la logique d'envoi programmé
    toast({
      title: "Envoi programmé avec succès",
      description: `Le rapport sera envoyé le ${format(date!, 'dd/MM/yyyy', { locale: fr })} à ${time}.`,
    });
    
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Programmer un envoi de rapport</DialogTitle>
          <DialogDescription>
            Définissez quand et comment vous souhaitez que le rapport soit envoyé.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="frequency">Fréquence</Label>
            <Tabs defaultValue={frequency} onValueChange={setFrequency} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="once">Une fois</TabsTrigger>
                <TabsTrigger value="daily">Quotidien</TabsTrigger>
                <TabsTrigger value="weekly">Hebdo</TabsTrigger>
                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid gap-2">
            <Label>Date de début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="time">Heure</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="emails">Destinataires</Label>
            <Input
              id="emails"
              placeholder="email@exemple.com, email2@exemple.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Séparez les adresses email par des virgules
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="attachment"
              checked={includeAttachment}
              onCheckedChange={(checked) => setIncludeAttachment(!!checked)}
            />
            <Label htmlFor="attachment" className="text-sm font-normal">
              Inclure le rapport en pièce jointe
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSchedule} className="gap-2">
            <Send className="h-4 w-4" />
            Programmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
