
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Calendar, Users, Plane, BookmarkPlus } from 'lucide-react';

const FlightPage = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  // Placeholder flight data
  const flights = [
    {
      id: 1,
      origin: 'New York',
      destination: 'London',
      date: 'Jun 15, 2025',
      price: '$649',
      airline: 'British Airways'
    },
    {
      id: 2,
      origin: 'Los Angeles',
      destination: 'Tokyo',
      date: 'Jun 20, 2025',
      price: '$1,249',
      airline: 'Japan Airlines'
    },
    {
      id: 3,
      origin: 'Chicago',
      destination: 'Paris',
      date: 'Jun 22, 2025',
      price: '$729',
      airline: 'Air France'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-emerald-500">
        <CardHeader>
          <CardTitle>Flight Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Origin</label>
              <Input 
                placeholder="City or Airport" 
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input 
                placeholder="City or Airport" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Departure Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="pl-10" 
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Return Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="pl-10" 
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Passengers</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Passengers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button className="w-full">Search Flights</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flights.map((flight) => (
          <Card key={flight.id} className="overflow-hidden">
            <CardHeader className="bg-emerald-500 text-white">
              <CardTitle className="flex justify-between">
                <span>Flight #{flight.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{flight.origin}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                  <span className="text-lg font-semibold">{flight.destination}</span>
                </div>
                
                <div className="text-sm text-muted-foreground">{flight.date}</div>
                
                <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200">
                  <div className="text-2xl font-bold">{flight.price}</div>
                  <div className="flex items-center text-muted-foreground">
                    <Plane className="h-4 w-4 mr-2" />
                    <span>{flight.airline}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="mt-2">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save Flight
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlightPage;
