
// Country API module
export const countryAPI = {
  // Mock data for countries
  mockCountryData: [
    {
      name: 'Japan',
      capital: 'Tokyo',
      population: '126.3 million',
      region: 'Asia',
      flag: '🇯🇵',
      tags: ['Island Nation', 'Cherry Blossoms', 'Technology'],
      currency: 'JPY'
    },
    {
      name: 'Italy',
      capital: 'Rome',
      population: '60.4 million',
      region: 'Europe',
      flag: '🇮🇹',
      tags: ['Mediterranean', 'History', 'Cuisine'],
      currency: 'EUR'
    },
    {
      name: 'New Zealand',
      capital: 'Wellington',
      population: '4.9 million',
      region: 'Oceania',
      flag: '🇳🇿',
      tags: ['Nature', 'Adventure', 'Lord of the Rings'],
      currency: 'NZD'
    },
    {
      name: 'United States',
      capital: 'Washington D.C.',
      population: '331 million',
      region: 'North America',
      flag: '🇺🇸',
      tags: ['Diverse', 'Technology', 'Entertainment'],
      currency: 'USD'
    },
    {
      name: 'UK',
      capital: 'London',
      population: '67 million',
      region: 'Europe',
      flag: '🇬🇧',
      tags: ['Historical', 'Monarchy', 'Tea'],
      currency: 'GBP'
    },
    {
      name: 'France',
      capital: 'Paris',
      population: '67.4 million',
      region: 'Europe',
      flag: '🇫🇷',
      tags: ['Art', 'Wine', 'Fashion'],
      currency: 'EUR'
    },
    {
      name: 'UAE',
      capital: 'Abu Dhabi',
      population: '9.9 million',
      region: 'Middle East',
      flag: '🇦🇪',
      tags: ['Desert', 'Luxury', 'Architecture'],
      currency: 'AED'
    },
    {
      name: 'Australia',
      capital: 'Canberra',
      population: '25.7 million',
      region: 'Oceania',
      flag: '🇦🇺',
      tags: ['Beach', 'Wildlife', 'Outback'],
      currency: 'AUD'
    }
  ],
  
  // Get all countries
  async getAllCountries() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.mockCountryData);
      }, 300);
    });
  },
  
  // Get information about a specific country
  async getCountryInfo(countryName) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Try to find an exact match first
        let country = this.mockCountryData.find(c => 
          c.name.toLowerCase() === countryName.toLowerCase()
        );
        
        // If no exact match, try partial match
        if (!country) {
          country = this.mockCountryData.find(c => 
            c.name.toLowerCase().includes(countryName.toLowerCase()) || 
            countryName.toLowerCase().includes(c.name.toLowerCase())
          );
        }
        
        // If still no match, generate random data
        if (!country) {
          country = {
            name: countryName,
            capital: `Capital of ${countryName}`,
            population: Math.floor(Math.random() * 100) + ' million',
            region: ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'][Math.floor(Math.random() * 6)],
            flag: '🏳️',
            tags: ['Travel Destination', 'Explore', 'New'],
            currency: 'USD'
          };
        }
        
        resolve(country);
      }, 300);
    });
  }
};
