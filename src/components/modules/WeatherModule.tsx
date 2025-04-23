
import { useState } from 'react';
import ModuleCard from '../ModuleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cloud, CloudSun, CloudRain } from 'lucide-react';

interface WeatherData {
  id: string;
  city: string;
  temperature: number;
  condition: string;
  icon: string;
}

const WeatherModule = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([
    {
      id: '1',
      city: 'New York',
      temperature: 72,
      condition: 'Partly Cloudy',
      icon: 'cloud-sun'
    },
    {
      id: '2',
      city: 'London',
      temperature: 63,
      condition: 'Rainy',
      icon: 'cloud-rain'
    },
    {
      id: '3',
      city: 'Tokyo',
      temperature: 81,
      condition: 'Cloudy',
      icon: 'cloud'
    }
  ]);

  const [newCity, setNewCity] = useState('');

  const handleAddCity = () => {
    if (newCity.trim() !== '') {
      const newWeatherData: WeatherData = {
        id: Date.now().toString(),
        city: newCity,
        temperature: Math.floor(Math.random() * 30) + 50, // Random temp between 50-80F
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        icon: ['cloud-sun', 'cloud', 'cloud-rain'][Math.floor(Math.random() * 3)]
      };
      
      setWeatherData([...weatherData, newWeatherData]);
      setNewCity('');
    }
  };

  const handleDeleteCity = (id: string) => {
    setWeatherData(weatherData.filter(w => w.id !== id));
  };

  const getWeatherIcon = (icon: string) => {
    switch(icon) {
      case 'cloud-sun': return <CloudSun className="h-10 w-10 text-blue-400" />;
      case 'cloud-rain': return <CloudRain className="h-10 w-10 text-blue-600" />;
      case 'cloud': return <Cloud className="h-10 w-10 text-gray-400" />;
      default: return <Cloud className="h-10 w-10" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Add a city to track..." 
          value={newCity} 
          onChange={(e) => setNewCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCity()}
          className="flex-1"
        />
        <Button onClick={handleAddCity} className="bg-[hsl(var(--weather-color))]">
          Add City
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weatherData.map((weather) => (
          <ModuleCard 
            key={weather.id}
            title={weather.city}
            type="weather"
            onDelete={() => handleDeleteCity(weather.id)}
            onEdit={() => console.log(`Edit weather for ${weather.city}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weather.icon)}
                <div>
                  <div className="text-2xl font-bold">{weather.temperature}°F</div>
                  <div className="text-gray-600">{weather.condition}</div>
                </div>
              </div>
            </div>
          </ModuleCard>
        ))}
      </div>
    </div>
  );
};

export default WeatherModule;
