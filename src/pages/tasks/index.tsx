
import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { ViewTabs } from "@/components/tasks/ViewTabs";
import { initialColumns } from "@/data/initialKanbanData";

const TasksPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Extraire toutes les tâches des colonnes initiales
  const allTasks = initialColumns.flatMap(column => column.tasks);

  return (
    <MainLayout>
      <div className="space-y-6">
        <TasksHeader onCreateTask={() => setIsCreateDialogOpen(true)} />
        <ViewTabs tasks={allTasks} />
        <TaskDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </MainLayout>
  );
};

export default TasksPage;
