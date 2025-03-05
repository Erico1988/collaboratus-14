
import { useState, useEffect } from "react";
import { Task, TaskFilter } from "@/types/task";
import { Market } from "@/types/market";
import { markets } from "@/data/markets";
import { initialColumns } from "@/data/initialKanbanData";
import { toast } from "sonner";

export function useTasks() {
  // Extraire toutes les tâches des colonnes initiales
  const allInitialTasks = initialColumns.flatMap(column => column.tasks);
  
  const [tasks, setTasks] = useState<Task[]>(allInitialTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(allInitialTasks);
  const [filters, setFilters] = useState<TaskFilter>({});
  
  // Enrichir les tâches avec les titres des marchés
  useEffect(() => {
    const enrichedTasks = tasks.map(task => {
      const market = markets.find(m => m.id === task.marketId);
      return {
        ...task,
        marketTitle: market?.title || "Marché inconnu"
      };
    });
    
    setTasks(enrichedTasks);
  }, []);
  
  // Appliquer les filtres
  useEffect(() => {
    let result = [...tasks];
    
    if (filters.status && filters.status.length > 0) {
      result = result.filter(task => filters.status?.includes(task.status));
    }
    
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter(task => filters.priority?.includes(task.priority));
    }
    
    if (filters.marketId) {
      result = result.filter(task => task.marketId === filters.marketId);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        task.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.dueDate?.start) {
      const startDate = new Date(filters.dueDate.start);
      result = result.filter(task => new Date(task.dueDate) >= startDate);
    }
    
    if (filters.dueDate?.end) {
      const endDate = new Date(filters.dueDate.end);
      result = result.filter(task => new Date(task.dueDate) <= endDate);
    }
    
    setFilteredTasks(result);
  }, [tasks, filters]);
  
  // Fonction pour créer une tâche
  const createTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTask]);
    toast.success("Tâche créée avec succès");
    return newTask;
  };
  
  // Fonction pour mettre à jour une tâche
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
          : task
      )
    );
    toast.success("Tâche mise à jour avec succès");
  };
  
  // Fonction pour supprimer une tâche
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success("Tâche supprimée avec succès");
  };
  
  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    markets
  };
}
