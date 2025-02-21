
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="fade-in">
          <h2 className="text-3xl font-bold mb-6">Tableau de bord</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-2">Marchés actifs</h3>
              <p className="text-3xl font-bold text-primary">12</p>
            </Card>
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-2">Tâches en cours</h3>
              <p className="text-3xl font-bold text-primary">28</p>
            </Card>
            <Card className="p-6 glass-panel">
              <h3 className="text-lg font-semibold mb-2">Échéances proches</h3>
              <p className="text-3xl font-bold text-primary">5</p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
