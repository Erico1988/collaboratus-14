
import { Card } from "@/components/ui/card";
import { Task, KanbanColumn as IKanbanColumn } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: IKanbanColumn;
  provided: any;
}

export const KanbanColumn = ({ column, provided }: KanbanColumnProps) => {
  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-lg border border-border p-4 min-h-[500px]"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <h3 className="font-semibold mb-4 text-lg">{column.title}</h3>
      <div className="space-y-3">
        {column.tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <TaskCard
                task={task}
                provided={provided}
                isDragging={snapshot.isDragging}
              />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    </div>
  );
};
