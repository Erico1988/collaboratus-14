import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import DocumentHeader from "@/components/documents/DocumentHeader";
import DocumentUpload from "@/components/documents/DocumentUpload";
import DocumentSearch from "@/components/documents/DocumentSearch";
import DocumentList from "@/components/documents/DocumentList";
import { mockDocuments } from "@/lib/data";
import { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface SearchFilters {
  types: string[];
  statuses: string[];
  date: string | null;
  authors: string[];
  tags: string[];
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters | undefined>();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredDocuments = documents.filter((doc) => {
    const matchesQuery =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!searchFilters || !matchesQuery) return matchesQuery;

    const matchesType =
      searchFilters.types.length === 0 ||
      searchFilters.types.includes(doc.fileType);

    const matchesStatus =
      searchFilters.statuses.length === 0 ||
      searchFilters.statuses.includes(doc.status);

    let matchesDate = true;
    if (searchFilters.date) {
      const docDate = new Date(doc.uploadedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);

      const lastMonthStart = new Date(today);
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

      const lastYearStart = new Date(today);
      lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);

      if (searchFilters.date === 'today') {
        matchesDate =
          docDate.getDate() === today.getDate() &&
          docDate.getMonth() === today.getMonth() &&
          docDate.getFullYear() === today.getFullYear();
      } else if (searchFilters.date === 'yesterday') {
        matchesDate =
          docDate.getDate() === yesterday.getDate() &&
          docDate.getMonth() === yesterday.getMonth() &&
          docDate.getFullYear() === yesterday.getFullYear();
      } else if (searchFilters.date === 'last-week') {
        matchesDate = docDate >= lastWeekStart;
      } else if (searchFilters.date === 'last-month') {
        matchesDate = docDate >= lastMonthStart;
      } else if (searchFilters.date === 'last-year') {
        matchesDate = docDate >= lastYearStart;
      }
    }

    const matchesAuthor =
      searchFilters.authors.length === 0 ||
      searchFilters.authors.includes(doc.uploadedBy.id);

    const matchesTags =
      searchFilters.tags.length === 0 ||
      (doc.tags && searchFilters.tags.some(tag => doc.tags?.includes(tag)));

    return matchesType && matchesStatus && matchesDate && matchesAuthor && matchesTags;
  });

  const handleSearch = (query: string, filters?: SearchFilters) => {
    setSearchQuery(query);
    if (filters) {
      setSearchFilters(filters);
    }
  };

  const handleUpload = (files: File[]) => {
    console.log("Files to upload:", files);
    // Here you would normally upload these files to your backend
    // And then update the documents list with the newly created documents
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <DocumentHeader 
          onUploadClick={() => setIsUploadOpen(!isUploadOpen)} 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {isUploadOpen && (
          <div className="mb-8 animate-slide-down">
            <DocumentUpload onUpload={handleUpload} />
          </div>
        )}

        <DocumentSearch onSearch={handleSearch} />

        <DocumentList documents={filteredDocuments} />

        {filteredDocuments.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline">
              Charger plus
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DocumentsPage;