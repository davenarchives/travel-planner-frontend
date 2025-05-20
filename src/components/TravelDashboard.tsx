
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const TravelDashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("weather");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search field empty",
        description: "Please enter a country or city to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // In a production app, we would make actual API calls here
      // For now, we'll just simulate a response with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSearchResults({
        weather: {
          temperature: "23°C",
          condition: "Partly Cloudy",
          humidity: "65%",
          wind: "10 km/h",
        },
        country: {
          name: searchQuery,
          capital: "Capital City",
          population: "10 million",
          currency: "Local Currency",
          languages: ["Language 1", "Language 2"],
          flag: "🏳️"
        },
        currency: {
          code: "USD",
          rate: 1.0,
          updatedAt: new Date().toLocaleDateString(),
        },
        news: [
          { title: "Travel Update for " + searchQuery, source: "Travel News", date: "Today" },
          { title: "Tourism Boom in " + searchQuery, source: "Tourism Weekly", date: "Yesterday" },
        ],
        flights: [
          { from: "Your Location", to: searchQuery, price: "$350", airline: "Air Travel", date: "Next Week" },
          { from: "Your Location", to: searchQuery, price: "$420", airline: "Sky Lines", date: "Next Month" },
        ]
      });
      
      toast({
        title: "Search completed",
        description: `Found results for "${searchQuery}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold">Wanderlust Compass</h1>
          <p className="text-muted-foreground">Your all-in-one travel companion dashboard</p>
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search for a country or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col gap-2">
            <p className="text-center text-muted-foreground">Loading information...</p>
            <Progress value={60} className="w-full" />
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Results for "{searchQuery}"</h2>
            <Tabs defaultValue="weather" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="country">Country</TabsTrigger>
                <TabsTrigger value="currency">Currency</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="flights">Flights</TabsTrigger>
              </TabsList>

              {/* Weather Tab */}
              <TabsContent value="weather">
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{searchQuery} Weather</h3>
                      <p className="text-4xl font-bold mb-4">{searchResults.weather.temperature}</p>
                      <p className="text-lg">{searchResults.weather.condition}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground">Humidity</p>
                        <p className="font-bold">{searchResults.weather.humidity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wind</p>
                        <p className="font-bold">{searchResults.weather.wind}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Country Tab */}
              <TabsContent value="country">
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="text-5xl">{searchResults.country.flag}</div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-4">{searchResults.country.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Capital</p>
                          <p className="font-bold">{searchResults.country.capital}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Population</p>
                          <p className="font-bold">{searchResults.country.population}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Currency</p>
                          <p className="font-bold">{searchResults.country.currency}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Languages</p>
                          <p className="font-bold">{searchResults.country.languages.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Currency Tab */}
              <TabsContent value="currency">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Currency Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground">Local Currency</p>
                      <p className="font-bold">{searchResults.country.currency} ({searchResults.currency.code})</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Exchange Rate (USD)</p>
                      <p className="font-bold">{searchResults.currency.rate}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p>{searchResults.currency.updatedAt}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* News Tab */}
              <TabsContent value="news">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Latest Travel News</h3>
                  <div className="space-y-4">
                    {searchResults.news.map((item: any, index: number) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <h4 className="font-bold">{item.title}</h4>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{item.source}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Flights Tab */}
              <TabsContent value="flights">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Available Flights</h3>
                  <div className="space-y-4">
                    {searchResults.flights.map((flight: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                          <div>
                            <p className="font-bold">{flight.from} → {flight.to}</p>
                            <p className="text-muted-foreground">{flight.airline}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{flight.price}</p>
                            <p className="text-muted-foreground">{flight.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Initial Dashboard State (Before Search) */}
        {!searchResults && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col gap-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
              </div>
              <h3 className="font-bold text-lg">Weather Tracking</h3>
              <p className="text-muted-foreground">Monitor weather conditions for your destinations.</p>
            </Card>
            <Card className="p-6 flex flex-col gap-2">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
              </div>
              <h3 className="font-bold text-lg">Country Explorer</h3>
              <p className="text-muted-foreground">Save and compare details about countries you plan to visit.</p>
            </Card>
            <Card className="p-6 flex flex-col gap-2">
              <div className="h-12 w-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
              </div>
              <h3 className="font-bold text-lg">Currency Conversion</h3>
              <p className="text-muted-foreground">Track exchange rates for your travel destinations.</p>
            </Card>
            <Card className="p-6 flex flex-col gap-2">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              </div>
              <h3 className="font-bold text-lg">Travel News</h3>
              <p className="text-muted-foreground">Stay updated with the latest travel news and alerts.</p>
            </Card>
            <Card className="p-6 flex flex-col gap-2">
              <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
              </div>
              <h3 className="font-bold text-lg">Flight Search</h3>
              <p className="text-muted-foreground">Find and save flight options for your upcoming trips.</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelDashboard;
