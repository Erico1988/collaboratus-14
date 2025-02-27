
import { MainLayout } from "@/components/layout/MainLayout";
import { Markets } from "@/components/markets/Markets";
import { MarketsHeader } from "@/components/markets/MarketsHeader";

const MarketsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <MarketsHeader />
        <Markets />
      </div>
    </MainLayout>
  );
};

export default MarketsPage;
