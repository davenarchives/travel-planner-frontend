
import { useState } from 'react';
import ModuleCard from '../ModuleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Airplane } from 'lucide-react';

interface FlightSearch {
  id: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  price: string;
  airline: string;
  duration: string;
}

const FlightModule = () => {
  const [flightSearches, setFlightSearches] = useState<FlightSearch[]>([
    {
      id: '1',
      origin: 'New York (JFK)',
      destination: 'London (LHR)',
      departureDate: new Date('2025-06-15'),
      returnDate: new Date('2025-06-22'),
      price: '$750',
      airline: 'British Airways',
      duration: '7h 20m'
    },
    {
      id: '2',
      origin: 'San Francisco (SFO)',
      destination: 'Tokyo (NRT)',
      departureDate: new Date('2025-07-10'),
      returnDate: new Date('2025-07-24'),
      price: '$1,125',
      airline: 'Japan Airlines',
      duration: '11h 45m'
    },
    {
      id: '3',
      origin: 'Chicago (ORD)',
      destination: 'Paris (CDG)',
      departureDate: new Date('2025-05-20'),
      returnDate: new Date('2025-05-27'),
      price: '$820',
      airline: 'Air France',
      duration: '8h 05m'
    }
  ]);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const handleAddFlightSearch = () => {
    if (origin.trim() !== '' && destination.trim() !== '' && departureDate) {
      // In a real app, you would fetch flight data from the API
      const airlines = ['United', 'Delta', 'American Airlines', 'Lufthansa', 'Emirates', 'Singapore Airlines'];
      const randomAirline = airlines[Math.floor(Math.random() * airlines.length)];
      const randomPrice = Math.floor(Math.random() * 1000) + 500;
      const randomHours = Math.floor(Math.random() * 12) + 2;
      const randomMinutes = Math.floor(Math.random() * 60);
      
      const newFlightSearch: FlightSearch = {
        id: Date.now().toString(),
        origin,
        destination,
        departureDate,
        returnDate,
        price: `$${randomPrice}`,
        airline: randomAirline,
        duration: `${randomHours}h ${randomMinutes}m`
      };
      
      setFlightSearches([...flightSearches, newFlightSearch]);
      setOrigin('');
      setDestination('');
      setDepartureDate(undefined);
      setReturnDate(undefined);
    }
  };

  const handleDeleteFlightSearch = (id: string) => {
    setFlightSearches(flightSearches.filter(flight => flight.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input 
          placeholder="Origin (e.g., LAX)" 
          value={origin} 
          onChange={(e) => setOrigin(e.target.value)}
        />
        <Input 
          placeholder="Destination (e.g., JFK)" 
          value={destination} 
          onChange={(e) => setDestination(e.target.value)}
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !departureDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {departureDate ? format(departureDate, "PPP") : <span>Departure Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={departureDate}
              onSelect={setDepartureDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !returnDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {returnDate ? format(returnDate, "PPP") : <span>Return Date (Optional)</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={setReturnDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          onClick={handleAddFlightSearch} 
          className="md:col-span-2 bg-[hsl(var(--flight-color))]"
        >
          Add Flight Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {flightSearches.map((flight) => (
          <ModuleCard 
            key={flight.id}
            title={`${flight.origin} → ${flight.destination}`}
            type="flight"
            onDelete={() => handleDeleteFlightSearch(flight.id)}
            onEdit={() => console.log(`Edit flight search ${flight.id}`)}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-[hsl(var(--flight-color))]">
                  {flight.price}
                </div>
                <div className="flex items-center gap-1">
                  <Airplane className="h-5 w-5 text-[hsl(var(--flight-color))]" />
                  <span className="font-medium">{flight.airline}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-500">Departure</div>
                  <div className="font-medium">{format(new Date(flight.departureDate), "MMM d, yyyy")}</div>
                </div>
                
                {flight.returnDate && (
                  <div>
                    <div className="text-xs text-gray-500">Return</div>
                    <div className="font-medium">{format(new Date(flight.returnDate), "MMM d, yyyy")}</div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">Duration: {flight.duration}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[hsl(var(--flight-color))] border-[hsl(var(--flight-color))] hover:bg-[hsl(var(--flight-color)/10%)]"
                >
                  View Details
                </Button>
              </div>
            </div>
          </ModuleCard>
        ))}
      </div>
    </div>
  );
};

export default FlightModule;
