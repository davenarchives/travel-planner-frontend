
import { useState, useEffect } from 'react';
import ModuleCard from '../ModuleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  capital: string;
  population: string;
  region: string;
  flag: string;
  tags: string[];
}

interface CountryModuleProps {
  countryFilter?: string;
}

const CountryModule = ({ countryFilter }: CountryModuleProps) => {
  const [countries, setCountries] = useState<Country[]>([
    {
      id: '1',
      name: 'Japan',
      capital: 'Tokyo',
      population: '126.3 million',
      region: 'Asia',
      flag: '🇯🇵',
      tags: ['Bucket List', 'Cherry Blossoms']
    },
    {
      id: '2',
      name: 'Italy',
      capital: 'Rome',
      population: '60.4 million',
      region: 'Europe',
      flag: '🇮🇹',
      tags: ['Food', 'History']
    },
    {
      id: '3',
      name: 'New Zealand',
      capital: 'Wellington',
      population: '4.9 million',
      region: 'Oceania',
      flag: '🇳🇿',
      tags: ['Nature', 'Adventure']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [displayedCountries, setDisplayedCountries] = useState<Country[]>([]);

  // Filter countries based on countryFilter prop or user search
  useEffect(() => {
    if (countryFilter) {
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(countryFilter.toLowerCase())
      );
      
      // If no matches found and this is a search request, add the search term as a new country
      if (filtered.length === 0) {
        const newCountry: Country = {
          id: Date.now().toString(),
          name: countryFilter,
          capital: 'Sample Capital',
          population: 'Unknown',
          region: 'Unknown',
          flag: '🏳️',
          tags: ['New']
        };
        setCountries(prev => [...prev, newCountry]);
        setDisplayedCountries([newCountry]);
      } else {
        setDisplayedCountries(filtered);
      }
    } else {
      setDisplayedCountries(countries);
    }
  }, [countryFilter, countries]);

  const handleAddCountry = () => {
    if (searchTerm.trim() !== '') {
      // In a real app, you would fetch country data from the API here
      const newCountry: Country = {
        id: Date.now().toString(),
        name: searchTerm,
        capital: 'Sample Capital',
        population: 'Unknown',
        region: 'Unknown',
        flag: '🏳️',
        tags: ['New']
      };
      
      setCountries([...countries, newCountry]);
      setSearchTerm('');
    }
  };

  const handleDeleteCountry = (id: string) => {
    setCountries(countries.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4">
      {!countryFilter && (
        <div className="flex gap-2">
          <Input 
            placeholder="Search for a country..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCountry()}
            className="flex-1"
          />
          <Button onClick={handleAddCountry} className="bg-[hsl(var(--country-color))]">
            Add Country
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedCountries.map((country) => (
          <ModuleCard 
            key={country.id}
            title={`${country.flag} ${country.name}`}
            type="country"
            onDelete={() => handleDeleteCountry(country.id)}
            onEdit={() => console.log(`Edit country ${country.name}`)}
          >
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Capital:</div>
                <div className="text-sm">{country.capital}</div>
                
                <div className="text-sm font-medium">Population:</div>
                <div className="text-sm">{country.population}</div>
                
                <div className="text-sm font-medium">Region:</div>
                <div className="text-sm">{country.region}</div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {country.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-[hsl(var(--country-color)/10%)] text-[hsl(var(--country-color))]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </ModuleCard>
        ))}
      </div>
    </div>
  );
};

export default CountryModule;
