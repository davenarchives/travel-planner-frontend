export const countryAPI = {
  baseUrl: 'http://localhost:8000',

  // Get info about a single country
  async getCountryInfo(countryName) {
    try {
      const response = await fetch(`${this.baseUrl}/countries/${encodeURIComponent(countryName)}`);
      if (!response.ok) {
        throw new Error(`Country ${countryName} not found`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching country info:', error);
      return null;
    }
  },

  // Get all countries (requires you to implement GET /countries in Laravel)
  async getAllCountries() {
    try {
      const response = await fetch(`${this.baseUrl}/countries`);
      if (!response.ok) {
        throw new Error('Failed to fetch all countries');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all countries:', error);
      return [];
    }
  },

  // Search for countries (requires GET /countries?search=term OR falls back to client-side filtering)
  async searchCountries(searchTerm) {
    if (!searchTerm) return [];

    try {
      // If your Laravel API supports search query
      const response = await fetch(`${this.baseUrl}/countries?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Fallback to client-side search due to error:', error);

      // Fallback: get all and filter client-side
      const allCountries = await this.getAllCountries();
      const filtered = allCountries.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.capital && c.capital.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.region && c.region.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return filtered;
    }
  }
};
