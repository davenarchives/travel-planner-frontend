
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
    'Italy': 'EUR',
    'France': 'EUR',
    'UK': 'GBP',
    'Australia': 'AUD',
    'Canada': 'CAD',
    'China': 'CNY',
    'India': 'INR',
    'UAE': 'AED'
  },
  
  // Get exchange rate between two currencies
  async getExchangeRate(fromCurrency, toCurrency) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (this.mockExchangeRates[fromCurrency] && this.mockExchangeRates[fromCurrency][toCurrency]) {
          resolve(this.mockExchangeRates[fromCurrency][toCurrency]);
        } else {
          // Generate random rate for unknown pairs
          const rate = parseFloat((Math.random() * (1.5 - 0.5) + 0.5).toFixed(4));
          resolve(rate);
        }
      }, 300);
    });
  },
  
  // Get currency for a country
  async getCurrencyForCountry(countryName) {
    return new Promise(resolve => {
      setTimeout(() => {
        let currency = null;
        
        // Find exact match
        if (this.countryCurrencies[countryName]) {
          currency = this.countryCurrencies[countryName];
        } else {
          // Find partial match
          const countryKey = Object.keys(this.countryCurrencies).find(key => 
            key.toLowerCase().includes(countryName.toLowerCase()) || 
            countryName.toLowerCase().includes(key.toLowerCase())
          );
          
          if (countryKey) {
            currency = this.countryCurrencies[countryKey];
          } else {
            // Default to USD for unknown countries
            currency = 'USD';
          }
        }
        
        resolve(currency);
      }, 300);
    });
  },
  
  // Get currency conversion options for a country
  async getCurrencyByCountry(countryName) {
    const countryCurrency = await this.getCurrencyForCountry(countryName);
    const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
    
    // Filter out the country's own currency
    const targetCurrencies = currencies.filter(c => c !== countryCurrency);
    
    // Get exchange rates for the top 3 currencies
    const results = await Promise.all(
      targetCurrencies.slice(0, 3).map(async (toCurrency) => {
        const rate = await this.getExchangeRate(countryCurrency, toCurrency);
        return {
          fromCurrency: countryCurrency,
          toCurrency,
          rate
        };
      })
    );
    
    return results;
  }
};
