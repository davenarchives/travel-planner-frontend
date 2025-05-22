
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Cloud, CloudRain, Sun } from 'lucide-react';

const WeatherPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data
  const weatherItems = [
    {
      id: 1,
      city: 'New York',
      country: 'USA',
      temperature: 22,
      condition: 'Sunny',
      icon: Sun
    },
    {
      id: 2,
      city: 'London',
      country: 'UK',
      temperature: 18,
      condition: 'Cloudy',
      icon: Cloud
    },
    {
      id: 3,
      city: 'Tokyo',
      country: 'Japan',
      temperature: 28,
      condition: 'Rainy',
      icon: CloudRain
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-cyan-500">
        <CardHeader>
          <CardTitle>Weather Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="bg-cyan-500 text-white">
              <CardTitle className="flex justify-between">
                <span>{item.city}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="text-4xl mr-4">
                  <item.icon className="h-16 w-16 text-cyan-500" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{item.temperature}°C</div>
                  <div className="text-muted-foreground">{item.condition}</div>
                  <div className="text-sm text-muted-foreground">{item.city}, {item.country}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;
