
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';
import DashboardOverview from './modules/DashboardOverview';
import WeatherModule from './modules/WeatherModule';
import CountryModule from './modules/CountryModule';
import CurrencyModule from './modules/CurrencyModule';
import NewsModule from './modules/NewsModule';
import FlightModule from './modules/FlightModule';

type Module = 'dashboard' | 'weather' | 'country' | 'currency' | 'news' | 'flight';

const TravelDashboard = () => {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'weather':
        return <WeatherModule />;
      case 'country':
        return <CountryModule />;
      case 'currency':
        return <CurrencyModule />;
      case 'news':
        return <NewsModule />;
      case 'flight':
        return <FlightModule />;
    }
  };

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'weather':
        return 'Weather Tracking';
      case 'country':
        return 'Country Explorer';
      case 'currency':
        return 'Currency Conversion';
      case 'news':
        return 'Travel News';
      case 'flight':
        return 'Flight Search';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{getModuleTitle()}</h1>
            <p className="text-muted-foreground">
              {activeModule === 'dashboard' 
                ? 'Your travel planning dashboard with all modules' 
                : `Manage your ${activeModule} data with full CRUD capabilities`}
            </p>
          </div>
          {renderModule()}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TravelDashboard;
