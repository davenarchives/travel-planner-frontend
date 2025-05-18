
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeatherModule from './WeatherModule';
import CountryModule from './CountryModule';
import CurrencyModule from './CurrencyModule';
import NewsModule from './NewsModule';
import FlightModule from './FlightModule';
import { Cloud, Flag, Currency, Newspaper, Plane } from 'lucide-react';

interface CountrySearchModuleProps {
  countryName: string;
  focusModule?: 'weather' | 'country' | 'currency' | 'news' | 'flight';
}

const CountrySearchModule = ({ countryName, focusModule = 'weather' }: CountrySearchModuleProps) => {
  const [activeTab, setActiveTab] = useState<string>(focusModule);
  
  // Set the active tab when focusModule prop changes
  useEffect(() => {
    if (focusModule) {
      setActiveTab(focusModule);
    }
  }, [focusModule]);

  if (!countryName) {
    return (
      <div className="text-center p-12">
        <p className="text-xl text-muted-foreground">
          Please search for a country to see travel information
        </p>
      </div>
    );
  }

  // Helper function to filter module content by country
  const filterByCountry = (Component: React.ComponentType<any>) => (
    <div className="country-filter" data-country={countryName}>
      <Component countryFilter={countryName} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Travel Information for {countryName}</h2>
        <p className="opacity-90">Explore all travel data related to {countryName}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="weather" className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-[hsl(var(--weather-color))]" />
            <span className="hidden sm:inline">Weather</span>
          </TabsTrigger>
          <TabsTrigger value="country" className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-[hsl(var(--country-color))]" />
            <span className="hidden sm:inline">Country</span>
          </TabsTrigger>
          <TabsTrigger value="currency" className="flex items-center gap-2">
            <Currency className="h-4 w-4 text-[hsl(var(--currency-color))]" />
            <span className="hidden sm:inline">Currency</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-[hsl(var(--news-color))]" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="flight" className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-[hsl(var(--flight-color))]" />
            <span className="hidden sm:inline">Flights</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weather" className="p-4 border rounded-lg">
          <div className="mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Cloud className="h-5 w-5 text-[hsl(var(--weather-color))]" />
              Weather in {countryName}
            </h3>
          </div>
          {filterByCountry(WeatherModule)}
        </TabsContent>
        
        <TabsContent value="country" className="p-4 border rounded-lg">
          <div className="mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Flag className="h-5 w-5 text-[hsl(var(--country-color))]" />
              About {countryName}
            </h3>
          </div>
          {filterByCountry(CountryModule)}
        </TabsContent>
        
        <TabsContent value="currency" className="p-4 border rounded-lg">
          <div className="mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Currency className="h-5 w-5 text-[hsl(var(--currency-color))]" />
              Currency in {countryName}
            </h3>
          </div>
          {filterByCountry(CurrencyModule)}
        </TabsContent>
        
        <TabsContent value="news" className="p-4 border rounded-lg">
          <div className="mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-[hsl(var(--news-color))]" />
              News about {countryName}
            </h3>
          </div>
          {filterByCountry(NewsModule)}
        </TabsContent>
        
        <TabsContent value="flight" className="p-4 border rounded-lg">
          <div className="mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Plane className="h-5 w-5 text-[hsl(var(--flight-color))]" />
              Flights to {countryName}
            </h3>
          </div>
          {filterByCountry(FlightModule)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CountrySearchModule;
