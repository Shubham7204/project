import { DashboardTable } from '../components/DashboardTable';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="bg-yellow-400 border-4 border-black rounded-lg p-8 shadow-brutal mb-8">
        <h1 className="text-4xl font-black text-black">Dashboard</h1>
        <p className="text-xl font-bold text-black mt-2">
          Monitor your content analysis metrics and insights
        </p>
      </div>

      <DashboardTable />
    </div>
  );
} 