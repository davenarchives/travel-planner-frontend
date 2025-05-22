
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import ModuleCard from '@/components/ModuleCard';
import { Cloud, Flag, Banknote, Newspaper, Plane } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Weather Tracking',
      type: 'weather' as const,
      description: 'Monitor weather conditions for your favorite destinations.',
      icon: Cloud
    },
    {
      title: 'Country Explorer',
      type: 'country' as const,
      description: 'Save and compare details about countries you plan to visit.',
      icon: Flag
    },
    {
      title: 'Currency Conversion',
      type: 'currency' as const,
      description: 'Track exchange rates for your travel destinations.',
      icon: Banknote
    },
    {
      title: 'Travel News',
      type: 'news' as const,
      description: 'Stay updated with the latest travel news and alerts.',
      icon: Newspaper
    },
    {
      title: 'Flight Search',
      type: 'flight' as const,
      description: 'Find and save flight options for your upcoming trips.',
      icon: Plane
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary to-purple-700 text-white rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-3">Travel Planner Dashboard</h1>
        <p className="text-xl opacity-90 mb-2">Your intelligent travel management system</p>
        <p className="max-w-2xl mx-auto opacity-80">
          Plan your perfect journey with our comprehensive travel tools. Get real-time weather updates, 
          country information, currency conversion, latest travel news, and flight options - all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.type}
            title={module.title}
            type={module.type}
            onView={() => navigate(`/${module.type}`)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4 text-primary">
                <module.icon className="h-12 w-12" />
              </div>
              <p className="text-muted-foreground mb-4">{module.description}</p>
            </div>
          </ModuleCard>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
