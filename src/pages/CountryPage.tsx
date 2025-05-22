
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CountryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data
  const countries = [
    {
      id: 1,
      name: 'France',
      capital: 'Paris',
      population: '67 million',
      region: 'Europe',
      languages: ['French'],
      currency: 'Euro'
    },
    {
      id: 2,
      name: 'Japan',
      capital: 'Tokyo',
      population: '126 million',
      region: 'Asia',
      languages: ['Japanese'],
      currency: 'Yen'
    },
    {
      id: 3,
      name: 'Australia',
      capital: 'Canberra',
      population: '25 million',
      region: 'Oceania',
      languages: ['English'],
      currency: 'Australian Dollar'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle>Country Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search for a country..."
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
        {countries.map((country) => (
          <Card key={country.id} className="overflow-hidden">
            <CardHeader className="bg-purple-500 text-white">
              <CardTitle className="flex justify-between">
                <span>{country.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                <div className="text-muted-foreground">Capital:</div>
                <div>{country.capital}</div>
                <div className="text-muted-foreground">Population:</div>
                <div>{country.population}</div>
                <div className="text-muted-foreground">Region:</div>
                <div>{country.region}</div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {country.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                    {lang}
                  </Badge>
                ))}
                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                  {country.currency}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CountryPage;
