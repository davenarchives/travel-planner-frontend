
// Flight API module
export const flightAPI = {
  // Mock flight data
  mockFlightData: [
    {
      id: 1,
      origin: 'New York (JFK)',
      destination: 'London (LHR)',
      departureDate: '2025-06-15',
      returnDate: '2025-06-22',
      price: '$850',
      airline: 'British Airways',
      destinationCountry: 'UK'
    },
    {
      id: 2,
      origin: 'San Francisco (SFO)',
      destination: 'Tokyo (NRT)',
      departureDate: '2025-07-10',
      returnDate: '2025-07-25',
      price: '$1,200',
      airline: 'JAL',
      destinationCountry: 'Japan'
    },
    {
      id: 3,
      origin: 'Miami (MIA)',
      destination: 'Barcelona (BCN)',
      departureDate: '2025-08-05',
      returnDate: '2025-08-19',
      price: '$980',
      airline: 'Iberia',
      destinationCountry: 'Spain'
    },
    {
      id: 4,
      origin: 'Chicago (ORD)',
      destination: 'Paris (CDG)',
      departureDate: '2025-06-20',
      returnDate: '2025-07-05',
      price: '$930',
      airline: 'Air France',
      destinationCountry: 'France'
    },
    {
      id: 5,
      origin: 'Los Angeles (LAX)',
      destination: 'Sydney (SYD)',
      departureDate: '2025-09-12',
      returnDate: '2025-09-28',
      price: '$1,450',
      airline: 'Qantas',
      destinationCountry: 'Australia'
    },
    {
      id: 6,
      origin: 'London (LHR)',
      destination: 'Dubai (DXB)',
      departureDate: '2025-10-05',
      returnDate: '2025-10-15',
      price: '$780',
      airline: 'Emirates',
      destinationCountry: 'UAE'
    }
  ],
  
  // Airports by country
  countryAirports: {
    'Japan': ['Tokyo (NRT)', 'Tokyo (HND)', 'Osaka (KIX)'],
    'UK': ['London (LHR)', 'London (LGW)', 'Manchester (MAN)'],
    'France': ['Paris (CDG)', 'Paris (ORY)', 'Nice (NCE)'],
    'Italy': ['Rome (FCO)', 'Milan (MXP)', 'Venice (VCE)'],
    'Australia': ['Sydney (SYD)', 'Melbourne (MEL)', 'Brisbane (BNE)'],
    'United States': ['New York (JFK)', 'Los Angeles (LAX)', 'Chicago (ORD)'],
    'UAE': ['Dubai (DXB)', 'Abu Dhabi (AUH)'],
    'Spain': ['Barcelona (BCN)', 'Madrid (MAD)']
  },
  
  // Get all flights
  async getAllFlights() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.mockFlightData);
      }, 300);
    });
  },
  
  // Search for flights
  async searchFlights(origin, destination, departureDate) {
    return new Promise(resolve => {
      setTimeout(() => {
        const results = this.mockFlightData.filter(flight => 
          flight.origin.toLowerCase().includes(origin.toLowerCase()) &&
          flight.destination.toLowerCase().includes(destination.toLowerCase())
        );
        
        // If no exact matches, return flights to the destination
        if (results.length === 0) {
          const destinationResults = this.mockFlightData.filter(flight => 
            flight.destination.toLowerCase().includes(destination.toLowerCase())
          );
          
          if (destinationResults.length > 0) {
            resolve(destinationResults);
          } else {
            // Generate a random flight
            const airlines = ['American Airlines', 'Delta', 'United', 'Lufthansa', 'Emirates', 'Singapore Airlines'];
            const randomPrice = Math.floor(Math.random() * 1000) + 500;
            
            resolve([{
              id: 999,
              origin: origin || 'New York (JFK)',
              destination: destination,
              departureDate: departureDate || '2025-06-15',
              returnDate: '',
              price: `$${randomPrice}`,
              airline: airlines[Math.floor(Math.random() * airlines.length)]
            }]);
          }
        } else {
          resolve(results);
        }
      }, 300);
    });
  },
  
  // Get flights by destination country
  async getFlightsByDestination(countryName) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Try to find exact country match
        let results = this.mockFlightData.filter(flight => 
          flight.destinationCountry?.toLowerCase() === countryName.toLowerCase()
        );
        
        // If no exact matches, try partial match
        if (results.length === 0) {
          results = this.mockFlightData.filter(flight => 
            flight.destinationCountry?.toLowerCase()?.includes(countryName.toLowerCase()) ||
            countryName.toLowerCase().includes(flight.destinationCountry?.toLowerCase() || '')
          );
        }
        
        // If still no results, generate flights to the country
        if (results.length === 0) {
          // Find destinations for the country
          let destinations = [];
          
          // Check if we have airports for this country
          const countryKey = Object.keys(this.countryAirports).find(key => 
            key.toLowerCase() === countryName.toLowerCase() ||
            key.toLowerCase().includes(countryName.toLowerCase()) ||
            countryName.toLowerCase().includes(key.toLowerCase())
          );
          
          if (countryKey && this.countryAirports[countryKey]) {
            destinations = this.countryAirports[countryKey];
          } else {
            // Create fake destination
            destinations = [`${countryName} International Airport`];
          }
          
          // Generate flights to these destinations
          const airlines = ['American Airlines', 'Delta', 'United', 'Lufthansa', 'Emirates', 'Singapore Airlines'];
          const origins = ['New York (JFK)', 'London (LHR)', 'Tokyo (NRT)'];
          
          results = destinations.map((destination, index) => ({
            id: 1000 + index,
            origin: origins[index % origins.length],
            destination: destination,
            departureDate: '2025-06-15',
            returnDate: '2025-06-29',
            price: `$${Math.floor(Math.random() * 1000) + 500}`,
            airline: airlines[Math.floor(Math.random() * airlines.length)],
            destinationCountry: countryName
          }));
        }
        
        resolve(results);
      }, 300);
    });
  }
};
