import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "./RichTextEditor";
import { FileUpload } from "./FileUpload";
import { TaskDependencySelect } from "./TaskDependencySelect";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const taskSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string(),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  status: z.enum(["todo", "in_progress", "review", "done", "pending", "rejected", "assigned"] as const),
  dueDate: z.string(),
  assigneeName: z.string().optional(),
  dependsOn: z.array(z.string()).optional(),
  attachments: z.array(z.any()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
  { value: "urgent", label: "Urgente" },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "review", label: "En révision" },
  { value: "done", label: "Terminé" },
  { value: "pending", label: "Validation en cours" },
  { value: "rejected", label: "Rejeté" },
  { value: "assigned", label: "Assigné" }
];

export const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const { toast } = useToast();
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      ...task,
      dueDate: format(new Date(task.dueDate), "yyyy-MM-dd"),
    } : {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      dependsOn: [],
      attachments: [],
    },
  });

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: task ? "Tâche modifiée" : "Tâche créée",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de la tâche" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priorité</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une priorité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem
                        key={priority.value}
                        value={priority.value}
                      >
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'échéance</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="assigneeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigné à</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la personne assignée" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dependsOn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dépendances</FormLabel>
              <FormControl>
                <TaskDependencySelect
                  value={field.value || []}
                  onChange={field.onChange}
                  currentTaskId={task?.id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pièces jointes</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {task ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
