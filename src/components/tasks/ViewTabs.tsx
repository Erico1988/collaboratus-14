
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { KanbanBoard } from "./KanbanBoard";
import { GanttChart } from "./GanttChart";
import { TaskTable } from "./TaskTable";
import { Task } from "@/types/task";

interface ViewTabsProps {
  tasks: Task[];
  onTaskSelect?: (task: Task) => void;
}

export const ViewTabs = ({ tasks, onTaskSelect }: ViewTabsProps) => {
  return (
    <Tabs defaultValue="kanban" className="space-y-4">
      <TabsList>
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
        <TabsTrigger value="gantt">Gantt</TabsTrigger>
        <TabsTrigger value="table">Tableau</TabsTrigger>
      </TabsList>
      <TabsContent value="kanban">
        <KanbanBoard tasks={tasks} onTaskSelect={onTaskSelect} />
      </TabsContent>
      <TabsContent value="gantt">
        <GanttChart tasks={tasks} />
      </TabsContent>
      <TabsContent value="table">
        <div className="bg-white rounded-lg shadow p-6">
          <TaskTable tasks={tasks} onTaskSelect={onTaskSelect} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
