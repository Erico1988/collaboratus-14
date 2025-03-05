
import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { ViewTabs } from "@/components/tasks/ViewTabs";
import { TaskFilters } from "@/components/tasks/filters/TaskFilters";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskFilter } from "@/types/task";
import { TaskDetail } from "@/components/tasks/TaskDetail";

const TasksPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const { tasks, setFilters, filters, markets } = useTasks();
  
  const handleFilterChange = (newFilters: TaskFilter) => {
    setFilters(newFilters);
  };
  
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <TasksHeader onCreateTask={() => setIsCreateDialogOpen(true)} />
        
        <TaskFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          markets={markets}
        />
        
        <ViewTabs 
          tasks={tasks} 
          onTaskSelect={handleTaskSelect}
        />
        
        <TaskDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
        
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            markets={markets}
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default TasksPage;
