
// Country API module
export const countryAPI = {
  // Mock data for countries
  mockCountryData: {
    'Japan': {
      name: 'Japan',
      capital: 'Tokyo',
      population: '126.3 million',
      region: 'Asia',
      flag: '🇯🇵',
      tags: ['Bucket List', 'Cherry Blossoms']
    },
    'Italy': {
      name: 'Italy',
      capital: 'Rome',
      population: '60.4 million',
      region: 'Europe',
      flag: '🇮🇹',
      tags: ['Food', 'History']
    },
    'New Zealand': {
      name: 'New Zealand',
      capital: 'Wellington',
      population: '4.9 million',
      region: 'Oceania',
      flag: '🇳🇿',
      tags: ['Nature', 'Adventure']
    },
    'France': {
      name: 'France',
      capital: 'Paris',
      population: '67.3 million',
      region: 'Europe',
      flag: '🇫🇷',
      tags: ['Culture', 'Food']
    },
    'Canada': {
      name: 'Canada',
      capital: 'Ottawa',
      population: '37.6 million',
      region: 'North America',
      flag: '🇨🇦',
      tags: ['Nature', 'Winter']
    },
    'Australia': {
      name: 'Australia',
      capital: 'Canberra',
      population: '25.4 million',
      region: 'Oceania',
      flag: '🇦🇺',
      tags: ['Beaches', 'Outback']
    },
    'Thailand': {
      name: 'Thailand',
      capital: 'Bangkok',
      population: '69.6 million',
      region: 'Asia',
      flag: '🇹🇭',
      tags: ['Temples', 'Food']
    },
    'United States': {
      name: 'United States',
      capital: 'Washington D.C.',
      population: '331 million',
      region: 'North America',
      flag: '🇺🇸',
      tags: ['Cities', 'National Parks']
    },
    'UK': {
      name: 'United Kingdom',
      capital: 'London',
      population: '66.8 million',
      region: 'Europe',
      flag: '🇬🇧',
      tags: ['History', 'Culture']
    }
  },
  
  // Get info about a country
  async getCountryInfo(countryName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Try to find an exact match
        if (this.mockCountryData[countryName]) {
          resolve(this.mockCountryData[countryName]);
        } else {
          // Try to find a country that contains the search term
          const matchedCountry = Object.keys(this.mockCountryData).find(name => 
            name.toLowerCase().includes(countryName.toLowerCase()) || 
            countryName.toLowerCase().includes(name.toLowerCase())
          );
          
          if (matchedCountry) {
            resolve(this.mockCountryData[matchedCountry]);
          } else {
            // Generate mock data for unknown countries
            const regions = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];
            const flags = ['🏳️', '🏴', '🏁', '🏳️‍🌈', '🏳️‍⚧️'];
            const tags = [
              'Visit', 'Explore', 'Bucket List', 'Adventure', 'Nature', 'History', 'Culture', 
              'Food', 'Beaches', 'Mountains', 'Cities', 'Architecture'
            ];
            
            // Generate 2-3 random tags
            const numTags = Math.floor(Math.random() * 2) + 2;
            const randomTags = [];
            for (let i = 0; i < numTags; i++) {
              const tag = tags[Math.floor(Math.random() * tags.length)];
              if (!randomTags.includes(tag)) {
                randomTags.push(tag);
              }
            }
            
            resolve({
              name: countryName,
              capital: 'Capital City',
              population: `${Math.floor(Math.random() * 90) + 1} million`,
              region: regions[Math.floor(Math.random() * regions.length)],
              flag: flags[Math.floor(Math.random() * flags.length)],
              tags: randomTags
            });
          }
        }
      }, 300);
    });
  },
  
  // Get all countries
  async getAllCountries() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(this.mockCountryData));
      }, 300);
    });
  },
  
  // Search for countries (returns array of matching countries)
  async searchCountries(searchTerm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!searchTerm) {
          resolve([]);
          return;
        }
        
        const results = Object.values(this.mockCountryData).filter(country => 
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          country.capital.toLowerCase().includes(searchTerm.toLowerCase()) || 
          country.region.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (results.length > 0) {
          resolve(results);
        } else {
          // If no results, create a mock country
          this.getCountryInfo(searchTerm).then(mockCountry => {
            resolve([mockCountry]);
          });
        }
      }, 300);
    });
  }
};
