
// Currency API module
export const currencyAPI = {
  // Mock exchange rates
  mockExchangeRates: {
    'USD': {
      'EUR': 0.91,
      'JPY': 145.12,
      'GBP': 0.78,
      'CAD': 1.35,
      'AUD': 1.49,
      'CNY': 7.21,
      'INR': 83.12
    },
    'EUR': {
      'USD': 1.10,
      'JPY': 159.58,
      'GBP': 0.86,
      'CAD': 1.48,
      'AUD': 1.64,
      'CNY': 7.92,
      'INR': 91.28
    },
    'JPY': {
      'USD': 0.0069,
      'EUR': 0.0063,
      'GBP': 0.0054,
      'CAD': 0.0093,
      'AUD': 0.010,
      'CNY': 0.050,
      'INR': 0.57
    },
    'GBP': {
      'USD': 1.28,
      'EUR': 1.17,
      'JPY': 186.22,
      'CAD': 1.73,
      'AUD': 1.91,
      'CNY': 9.25,
      'INR': 106.52
    }
  },
  
  // Country to currency mapping
  countryCurrencies: {
    'United States': 'USD',
    'Japan': 'JPY',
    'EU': 'EUR',
    'UK': 'GBP',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'China': 'CNY',
    'India': 'INR'
  },
  
  // Get exchange rate between two currencies
  async getExchangeRate(fromCurrency, toCurrency) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if we have the rate in our mock data
        if (this.mockExchangeRates[fromCurrency] && this.mockExchangeRates[fromCurrency][toCurrency]) {
          resolve(this.mockExchangeRates[fromCurrency][toCurrency]);
        } else if (fromCurrency === toCurrency) {
          resolve(1.0);
        } else {
          // Generate a random exchange rate if not found
          const baseRate = Math.random() * 2;
          resolve(baseRate);
        }
      }, 300);
    });
  },
  
  // Get currency by country name
  async getCurrencyByCountry(countryName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find matching country
        let countryCurrency = null;
        
        // Check exact match
        if (this.countryCurrencies[countryName]) {
          countryCurrency = this.countryCurrencies[countryName];
        } else {
          // Check if country name contains the search term
          const countryKey = Object.keys(this.countryCurrencies).find(key => 
            key.toLowerCase().includes(countryName.toLowerCase()) || 
            countryName.toLowerCase().includes(key.toLowerCase())
          );
          
          if (countryKey) {
            countryCurrency = this.countryCurrencies[countryKey];
          } else {
            // Use USD for unknown countries
            countryCurrency = 'USD';
          }
        }
        
        // Create currency pairs with the country's currency
        const currencies = ['USD', 'EUR', 'GBP'];
        const currencyPairs = [];
        
        for (const currency of currencies) {
          if (currency !== countryCurrency) {
            this.getExchangeRate(countryCurrency, currency).then(rate => {
              currencyPairs.push({
                fromCurrency: countryCurrency,
                toCurrency: currency,
                rate: rate,
                lastUpdated: new Date().toISOString()
              });
            });
            
            currencyPairs.push({
              fromCurrency: currency,
              toCurrency: countryCurrency,
              rate: Math.random() * 2,
              lastUpdated: new Date().toISOString()
            });
          }
        }
        
        resolve(currencyPairs);
      }, 300);
    });
  }
};
