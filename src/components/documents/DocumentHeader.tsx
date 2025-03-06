import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Table, Grid } from "lucide-react";

interface DocumentHeaderProps {
    onUploadClick: () => void;
    viewMode: "grid" | "table";
    onViewModeChange: (mode: "grid" | "table") => void;
}

const DocumentHeader = ({
                            onUploadClick,
                            viewMode,
                            onViewModeChange,
                        }: DocumentHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold">Documents</h1>
                <p className="text-muted-foreground mt-1">
                    Gérez tous vos documents liés aux marchés publics
                </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <div className="flex items-center p-1 bg-muted rounded-md">
                    <button
                        className={`p-1.5 rounded-md ${
                            viewMode === "grid"
                                ? "bg-background shadow-sm"
                                : "text-muted-foreground"
                        }`}
                        onClick={() => onViewModeChange("grid")}
                    >
                        <Grid className="h-5 w-5" />
                    </button>
                    <button
                        className={`p-1.5 rounded-md ${
                            viewMode === "table"
                                ? "bg-background shadow-sm"
                                : "text-muted-foreground"
                        }`}
                        onClick={() => onViewModeChange("table")}
                    >
                        <Table className="h-5 w-5" />
                    </button>
                </div>

                <Button onClick={onUploadClick}>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Importer
                </Button>
            </div>
        </div>
    );
};

export default DocumentHeader;
