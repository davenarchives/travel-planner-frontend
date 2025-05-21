
// Flight API module
export const flightAPI = {
  // Mock flight data
  mockFlightData: [
    {
      id: '1',
      origin: 'New York',
      destination: 'London',
      departureDate: '2025-06-15',
      returnDate: '2025-06-22',
      price: '$750',
      airline: 'British Airways'
    },
    {
      id: '2',
      origin: 'San Francisco',
      destination: 'Tokyo',
      departureDate: '2025-07-10',
      returnDate: '2025-07-24',
      price: '$1,125',
      airline: 'Japan Airlines'
    },
    {
      id: '3',
      origin: 'Chicago',
      destination: 'Paris',
      departureDate: '2025-05-20',
      returnDate: '2025-05-27',
      price: '$820',
      airline: 'Air France'
    },
    {
      id: '4',
      origin: 'Miami',
      destination: 'Cancun',
      departureDate: '2025-06-05',
      returnDate: '2025-06-12',
      price: '$320',
      airline: 'American Airlines'
    },
    {
      id: '5',
      origin: 'Los Angeles',
      destination: 'Sydney',
      departureDate: '2025-08-15',
      returnDate: '2025-08-30',
      price: '$1,450',
      airline: 'Qantas'
    }
  ],
  
  // Major airports by country
  countryAirports: {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Dallas'],
    'UK': ['London', 'Manchester', 'Edinburgh', 'Glasgow', 'Birmingham'],
    'Japan': ['Tokyo', 'Osaka', 'Fukuoka', 'Sapporo', 'Nagoya'],
    'France': ['Paris', 'Nice', 'Lyon', 'Marseille', 'Toulouse'],
    'Italy': ['Rome', 'Milan', 'Venice', 'Naples', 'Florence'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  },
  
  // Get all saved flights
  async getAllFlights() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockFlightData);
      }, 300);
    });
  },
  
  // Search for flights
  async searchFlights(origin, destination, departureDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random search results
        const airlines = [
          'United Airlines', 'Delta', 'American Airlines', 'British Airways', 
          'Lufthansa', 'Air France', 'KLM', 'Emirates', 'Qatar Airways', 
          'Singapore Airlines', 'Cathay Pacific', 'Japan Airlines'
        ];
        
        const results = [];
        const numResults = Math.floor(Math.random() * 5) + 3; // 3-8 results
        
        for (let i = 0; i < numResults; i++) {
          const airline = airlines[Math.floor(Math.random() * airlines.length)];
          const basePrice = Math.floor(Math.random() * 1000) + 300; // $300-1300
          
          // Adjust price based on class
          let price;
          let id = `search-${Date.now()}-${i}`;
          
          if (i === 0) {
            price = `$${basePrice - 50}`; // Cheapest option
          } else if (i === numResults - 1) {
            price = `$${basePrice + 200}`; // Premium option
          } else {
            price = `$${basePrice}`;
          }
          
          results.push({
            id: id,
            origin: origin,
            destination: destination,
            departureDate: departureDate,
            returnDate: '', // One-way flight
            price: price,
            airline: airline
          });
        }
        
        resolve(results);
      }, 300);
    });
  },
  
  // Get flights by destination
  async getFlightsByDestination(destination) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find matching country for destination
        let airports = [];
        
        // Check if destination is a country we have in our mappings
        if (this.countryAirports[destination]) {
          airports = this.countryAirports[destination];
        } else {
          // Check if destination is part of a country name
          const countryKey = Object.keys(this.countryAirports).find(key => 
            key.toLowerCase().includes(destination.toLowerCase()) || 
            destination.toLowerCase().includes(key.toLowerCase())
          );
          
          if (countryKey) {
            airports = this.countryAirports[countryKey];
          } else {
            // Use the destination as a single airport
            airports = [destination];
          }
        }
        
        // Generate flights to the found airports
        const results = [];
        const origins = ['New York', 'London', 'Tokyo', 'Los Angeles', 'Paris'];
        const airlines = [
          'United Airlines', 'Delta', 'American Airlines', 'British Airways', 
          'Lufthansa', 'Air France', 'KLM', 'Emirates', 'Qatar Airways'
        ];
        
        // Pick a random origin
        const origin = origins[Math.floor(Math.random() * origins.length)];
        
        // Generate 1-3 flights
        const numResults = Math.min(3, airports.length);
        
        for (let i = 0; i < numResults; i++) {
          const airport = airports[i];
          const airline = airlines[Math.floor(Math.random() * airlines.length)];
          const basePrice = Math.floor(Math.random() * 800) + 400; // $400-1200
          
          // Generate a departure date 1-3 months in the future
          const daysToAdd = Math.floor(Math.random() * 90) + 30; // 30-120 days
          const departureDate = new Date();
          departureDate.setDate(departureDate.getDate() + daysToAdd);
          
          // Generate a return date 7-14 days after departure
          const stayDuration = Math.floor(Math.random() * 7) + 7; // 7-14 days
          const returnDate = new Date(departureDate);
          returnDate.setDate(returnDate.getDate() + stayDuration);
          
          results.push({
            id: `dest-${Date.now()}-${i}`,
            origin: origin,
            destination: airport,
            departureDate: departureDate.toISOString().split('T')[0],
            returnDate: returnDate.toISOString().split('T')[0],
            price: `$${basePrice}`,
            airline: airline
          });
        }
        
        resolve(results);
      }, 300);
    });
  }
};
