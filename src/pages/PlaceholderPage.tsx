import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="fade-in">
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
          <Card className="p-8 glass-panel">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <path d="M12 19l-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Page en construction</h3>
              <p className="text-muted-foreground max-w-md">
                Cette fonctionnalité est actuellement en cours de développement et sera disponible prochainement.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PlaceholderPage;