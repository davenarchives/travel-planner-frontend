
// Weather API module
export const weatherAPI = {
  // Mock data for weather
  mockWeatherData: {
    'New York': {
      temperature: 72,
      condition: 'Partly Cloudy',
      icon: 'fa-cloud-sun'
    },
    'London': {
      temperature: 63,
      condition: 'Rainy',
      icon: 'fa-cloud-rain'
    },
    'Tokyo': {
      temperature: 81,
      condition: 'Cloudy',
      icon: 'fa-cloud'
    },
    'Paris': {
      temperature: 70,
      condition: 'Sunny',
      icon: 'fa-sun'
    },
    'Dubai': {
      temperature: 95,
      condition: 'Clear',
      icon: 'fa-sun'
    },
    'Sydney': {
      temperature: 68,
      condition: 'Partly Cloudy',
      icon: 'fa-cloud-sun'
    }
  },
  
  // Country to cities mapping
  countryToCities: {
    'United States': ['New York', 'Los Angeles', 'Chicago'],
    'UK': ['London', 'Manchester', 'Edinburgh'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto'],
    'France': ['Paris', 'Lyon', 'Marseille'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane']
  },
  
  // Get weather data for a city
  async getWeather(city) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.mockWeatherData[city]) {
          resolve({
            city: city,
            ...this.mockWeatherData[city]
          });
        } else {
          // Generate random weather for unknown cities
          const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear'];
          const icons = ['fa-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-cloud-sun', 'fa-sun'];
          const randomIndex = Math.floor(Math.random() * conditions.length);
          
          resolve({
            city: city,
            temperature: Math.floor(Math.random() * 30) + 50, // 50-80°F
            condition: conditions[randomIndex],
            icon: icons[randomIndex]
          });
        }
      }, 300);
    });
  },
  
  // Get weather data for multiple cities
  async getWeatherForCities(cities) {
    const weatherPromises = cities.map(city => this.getWeather(city));
    return Promise.all(weatherPromises);
  },
  
  // Get weather data by country
  async getWeatherByCountry(country) {
    // Find matching country
    let cities = [];
    
    // Check exact match
    if (this.countryToCities[country]) {
      cities = this.countryToCities[country];
    } else {
      // Check if country name contains the search term
      const countryKey = Object.keys(this.countryToCities).find(key => 
        key.toLowerCase().includes(country.toLowerCase()) || 
        country.toLowerCase().includes(key.toLowerCase())
      );
      
      if (countryKey) {
        cities = this.countryToCities[countryKey];
      } else {
        // Return random cities for unknown countries
        const allCities = Object.values(this.countryToCities).flat();
        cities = [
          allCities[Math.floor(Math.random() * allCities.length)],
          allCities[Math.floor(Math.random() * allCities.length)]
        ];
      }
    }
    
    return this.getWeatherForCities(cities);
  }
};
