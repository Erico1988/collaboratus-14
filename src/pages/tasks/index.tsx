
import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { ViewTabs } from "@/components/tasks/ViewTabs";
import { procureTrackTasks } from "@/data/tasks";

const TasksPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        <TasksHeader onCreateTask={() => setIsCreateDialogOpen(true)} />
        <ViewTabs tasks={procureTrackTasks} />
        <TaskDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </MainLayout>
  );
};

export default TasksPage;
