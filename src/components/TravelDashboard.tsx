
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';
import DashboardOverview from './modules/DashboardOverview';
import CountrySearchModule from './modules/CountrySearchModule';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

type Module = 'dashboard' | 'search' | 'weather' | 'country' | 'currency' | 'news' | 'flight';

const TravelDashboard = () => {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedCountry, setSearchedCountry] = useState<string>('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchedCountry(searchTerm);
      setActiveModule('search');
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview onModuleSelect={setActiveModule} />;
      case 'search':
        return <CountrySearchModule countryName={searchedCountry} />;
      case 'weather':
      case 'country':
      case 'currency':
      case 'news':
      case 'flight':
        // When user selects a specific module, we'll show the country search view with focus on that module
        return <CountrySearchModule countryName={searchedCountry} focusModule={activeModule} />;
      default:
        return <DashboardOverview onModuleSelect={setActiveModule} />;
    }
  };

  const getModuleTitle = () => {
    if (activeModule === 'search' && searchedCountry) {
      return `${searchedCountry} Travel Information`;
    }

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
      default:
        return 'Wanderlust Compass';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{getModuleTitle()}</h1>
                <p className="text-muted-foreground">
                  {activeModule === 'search' 
                    ? `Comprehensive travel information for ${searchedCountry}`
                    : activeModule === 'dashboard' 
                      ? 'Your travel planning dashboard with all modules' 
                      : `Manage your ${activeModule} data with full CRUD capabilities`}
                </p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Input 
                  placeholder="Search for a country..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full md:w-64"
                />
                <Button onClick={handleSearch} className="bg-[hsl(var(--sidebar-primary))]">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {renderModule()}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TravelDashboard;
