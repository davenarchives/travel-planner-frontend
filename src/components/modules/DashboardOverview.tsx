
import ModuleCard from '../ModuleCard';
import { Cloud, Flag, Currency, Newspaper, Airplane } from 'lucide-react';

const DashboardOverview = () => {
  const modules = [
    {
      id: 'weather',
      title: 'Weather Tracking',
      type: 'weather',
      description: 'Monitor weather conditions for your favorite destinations.',
      icon: Cloud,
      count: 3
    },
    {
      id: 'country',
      title: 'Country Explorer',
      type: 'country',
      description: 'Save and compare details about countries you plan to visit.',
      icon: Flag,
      count: 3
    },
    {
      id: 'currency',
      title: 'Currency Conversion',
      type: 'currency',
      description: 'Track exchange rates for your travel destinations.',
      icon: Currency,
      count: 3
    },
    {
      id: 'news',
      title: 'Travel News',
      type: 'news',
      description: 'Stay updated with the latest travel news and alerts.',
      icon: Newspaper,
      count: 3
    },
    {
      id: 'flight',
      title: 'Flight Search',
      type: 'flight',
      description: 'Find and save flight options for your upcoming trips.',
      icon: Airplane,
      count: 3
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Wanderlust Compass Dashboard</h1>
        <p className="opacity-90">Your complete travel planning companion with CRUD functionality</p>
        <p className="text-sm opacity-80 mt-4">Each module connects to external APIs while providing full create, read, update, and delete capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const ModuleIcon = module.icon;
          
          return (
            <ModuleCard
              key={module.id}
              title={module.title}
              type={module.type as any}
              onView={() => console.log(`Navigate to ${module.id} module`)}
            >
              <div className="flex flex-col items-center text-center p-2">
                <ModuleIcon className="h-12 w-12 mb-3 text-[hsl(var(--${module.type}-color))]" />
                <p className="text-gray-600 mb-2">{module.description}</p>
                <div className="font-semibold mt-2">
                  {module.count} saved items
                </div>
              </div>
            </ModuleCard>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardOverview;
