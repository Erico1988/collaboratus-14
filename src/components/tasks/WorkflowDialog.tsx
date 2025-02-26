
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Plus, Settings, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { KanbanColumn, TaskAutomation } from "@/types/task";

interface WorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  columns: KanbanColumn[];
}

interface FormValues {
  automations: Record<string, TaskAutomation[]>;
}

export function WorkflowDialog({
  open,
  onOpenChange,
  onSubmit,
  columns,
}: WorkflowDialogProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      automations: columns.reduce((acc, col) => ({
        ...acc,
        [col.id]: col.automations || [],
      }), {}),
    },
  });

  const addAutomation = (columnId: string) => {
    const currentAutomations = form.getValues().automations[columnId] || [];
    form.setValue("automations", {
      ...form.getValues().automations,
      [columnId]: [
        ...currentAutomations,
        {
          id: `auto-${Date.now()}`,
          trigger: "status_change",
          action: "send_notification",
          parameters: {},
        },
      ],
    });
  };

  const removeAutomation = (columnId: string, index: number) => {
    const columnAutomations = [...(form.getValues().automations[columnId] || [])];
    columnAutomations.splice(index, 1);
    form.setValue("automations", {
      ...form.getValues().automations,
      [columnId]: columnAutomations,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gestion du workflow</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {columns.map((column) => (
              <Card key={column.id} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">{column.title}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAutomation(column.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une automation
                  </Button>
                </div>

                <div className="space-y-4">
                  {form.watch(`automations.${column.id}`)?.map((auto: TaskAutomation, index: number) => (
                    <div key={auto.id} className="flex gap-4 items-start">
                      <div className="flex-1 space-y-4">
                        <FormField
                          control={form.control}
                          name={`automations.${column.id}.${index}.trigger`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Déclencheur</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un déclencheur" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="status_change">
                                    Changement de statut
                                  </SelectItem>
                                  <SelectItem value="deadline_approaching">
                                    Date limite approche
                                  </SelectItem>
                                  <SelectItem value="document_missing">
                                    Document manquant
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`automations.${column.id}.${index}.action`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Action</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une action" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="send_notification">
                                    Envoyer une notification
                                  </SelectItem>
                                  <SelectItem value="change_status">
                                    Changer le statut
                                  </SelectItem>
                                  <SelectItem value="assign_user">
                                    Assigner un utilisateur
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAutomation(column.id, index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            <DialogFooter>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
