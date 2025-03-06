import React, { useState } from "react";
import { Search, Filter, X, Calendar, User, FileType, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Button from "../ui/button";
import { mockUsers } from "@/lib/data";

// Types pour les filtres
interface SearchFilters {
  types: string[];
  statuses: string[];
  date: string | null;
  authors: string[];
  tags: string[];
}

interface DocumentSearchProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
}

const DocumentSearch = ({ onSearch }: DocumentSearchProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    statuses: [],
    date: null,
    authors: [],
    tags: [],
  });
  const [advancedMode, setAdvancedMode] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([
    "appel d'offres", "construction", "école", "technique", "informatique",
    "maintenance", "contrat", "budget", "finance", "analyse"
  ]);

  // Options pour les selects
  const typeOptions = [
    { value: "pdf", label: "PDF" },
    { value: "doc", label: "DOC/DOCX" },
    { value: "xls", label: "XLS/XLSX" },
    { value: "ppt", label: "PPT/PPTX" },
    { value: "txt", label: "TXT" },
    { value: "image", label: "Images" },
  ];

  const statusOptions = [
    { value: "draft", label: "Brouillon" },
    { value: "pending", label: "En attente" },
    { value: "approved", label: "Approuvé" },
    { value: "rejected", label: "Rejeté" },
    { value: "archived", label: "Archivé" },
  ];

  const dateOptions = [
    { value: "all", label: "Toutes les dates" },
    { value: "today", label: "Aujourd'hui" },
    { value: "yesterday", label: "Hier" },
    { value: "last-week", label: "Dernière semaine" },
    { value: "last-month", label: "Dernier mois" },
    { value: "last-year", label: "Dernière année" },
    { value: "custom", label: "Période personnalisée" },
  ];

  const authorOptions = mockUsers.map(user => ({
    value: user.id,
    label: user.name,
    image: user.avatar
  }));

  const tagOptions = availableTags.map(tag => ({
    value: tag,
    label: tag
  }));

  // Gérer la soumission du formulaire de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  // Réinitialiser tous les filtres
  const handleResetFilters = () => {
    setFilters({
      types: [],
      statuses: [],
      date: null,
      authors: [],
      tags: [],
    });
  };

  // Appliquer les filtres
  const handleApplyFilters = () => {
    onSearch(query, filters);
  };

  // Effacer la recherche
  const handleClear = () => {
    setQuery("");
    onSearch("", undefined);
  };

  // Mise à jour du filtre
  const handleFilterChange = (name: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ajouter un nouveau tag
  const handleCreateTag = (inputValue: string) => {
    const newValue = inputValue.trim();
    if (newValue && !availableTags.includes(newValue)) {
      setAvailableTags(prev => [...prev, newValue]);
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, newValue]
      }));
    }
  };

  return (
      <Card className="p-4 glass-panel">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    id="search"
                    placeholder="Rechercher un document..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-8"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de document</Label>
              <Select
                  value={filters.types.length > 0 ? filters.types[0] : undefined}
                  onValueChange={(value) => handleFilterChange('types', [value])}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                  value={filters.statuses.length > 0 ? filters.statuses[0] : undefined}
                  onValueChange={(value) => handleFilterChange('statuses', [value])}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Select
                  value={filters.date || "all"}
                  onValueChange={(value) => handleFilterChange('date', value === "all" ? null : value)}
              >
                <SelectTrigger id="date">
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filters.date === 'custom' && (
                <div className="space-y-2">
                  <Label>Période personnalisée</Label>
                  <div className="flex space-x-2">
                    <Input type="date" className="flex-1" />
                    <Input type="date" className="flex-1" />
                  </div>
                </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Select
                  value={filters.authors.length > 0 ? filters.authors[0] : undefined}
                  onValueChange={(value) => handleFilterChange('authors', [value])}
              >
                <SelectTrigger id="author">
                  <SelectValue placeholder="Tous les auteurs" />
                </SelectTrigger>
                <SelectContent>
                  {authorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Select
                  value={filters.tags.length > 0 ? filters.tags[0] : undefined}
                  onValueChange={(value) => handleFilterChange('tags', [value])}
              >
                <SelectTrigger id="tags">
                  <SelectValue placeholder="Tous les tags" />
                </SelectTrigger>
                <SelectContent>
                  {tagOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Appuyez sur Entrée ou ajoutez une virgule pour créer un nouveau tag
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleResetFilters}>
              Réinitialiser
            </Button>
            <Button type="submit">Rechercher</Button>
          </div>
        </form>

        {advancedMode && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p>Utilisez AND, OR, NOT pour des recherches plus précises. Exemple: "rapport AND budget NOT 2022"</p>
            </div>
        )}

        <div className="flex items-center mt-4">
          <Button
              type="button"
              variant="outline"
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres {filters.types.length + filters.statuses.length + (filters.date ? 1 : 0) + filters.authors.length + filters.tags.length > 0 &&
              `(${filters.types.length + filters.statuses.length + (filters.date ? 1 : 0) + filters.authors.length + filters.tags.length})`}
          </Button>

          <Button
              type="button"
              variant="ghost"
              className="hidden md:flex items-center ml-2"
              onClick={() => setAdvancedMode(!advancedMode)}
          >
            {advancedMode ? "Recherche simple" : "Recherche avancée"}
          </Button>
        </div>
      </Card>
  );
};

export default DocumentSearch;