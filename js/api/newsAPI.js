
// News API module
export const newsAPI = {
  // Mock news data
  mockNewsData: [
    {
      id: 1,
      title: 'New Travel Restrictions Lifted for Popular Tourist Destinations',
      source: 'Travel Weekly',
      publishedAt: '2025-05-15T14:30:00Z',
      snippet: 'Several countries have announced the removal of travel restrictions, opening doors for tourists after years of limited access.',
      category: 'Travel Alerts',
      country: 'Global',
      saved: false
    },
    {
      id: 2,
      title: 'The Hidden Beaches of Southeast Asia You Need to Visit',
      source: 'Wanderlust Magazine',
      publishedAt: '2025-05-12T09:15:00Z',
      snippet: 'Discover untouched paradises away from the typical tourist spots in Thailand, Indonesia, and the Philippines.',
      category: 'Destinations',
      country: 'Thailand',
      saved: false
    },
    {
      id: 3,
      title: 'Airlines Announce New Routes for Summer 2025',
      source: 'Aviation Today',
      publishedAt: '2025-05-10T16:45:00Z',
      snippet: 'Major airlines are expanding their networks with exciting new destinations for the upcoming summer season.',
      category: 'Flight News',
      country: 'Global',
      saved: false
    },
    {
      id: 4,
      title: 'Japan Cherry Blossom Festival Dates Announced for 2026',
      source: 'Japan Travel',
      publishedAt: '2025-05-08T11:20:00Z',
      snippet: 'Plan your trip to Japan for the next cherry blossom season with these official festival dates for major cities.',
      category: 'Events',
      country: 'Japan',
      saved: false
    },
    {
      id: 5,
      title: 'Italy Reopens Historical Sites with New Visitor Guidelines',
      source: 'European Tourism',
      publishedAt: '2025-05-06T13:45:00Z',
      snippet: 'Italian authorities have introduced new guidelines for visitors to famous historical sites to preserve cultural heritage.',
      category: 'Cultural News',
      country: 'Italy',
      saved: false
    },
    {
      id: 6,
      title: 'Australia Introduces New Visa Program for Digital Nomads',
      source: 'Pacific Travel',
      publishedAt: '2025-05-04T08:30:00Z',
      snippet: 'Remote workers can now stay longer in Australia with a new visa program designed for digital nomads.',
      category: 'Travel Policy',
      country: 'Australia',
      saved: false
    },
    {
      id: 7,
      title: 'New High-Speed Train Connects Paris and Berlin in Under 5 Hours',
      source: 'European Rail News',
      publishedAt: '2025-05-02T10:15:00Z',
      snippet: 'The new high-speed rail line between Paris and Berlin reduces travel time significantly, offering a sustainable alternative to flights.',
      category: 'Transportation',
      country: 'France',
      saved: false
    },
    {
      id: 8,
      title: 'UAE Announces Winter Festival of Lights for Dubai',
      source: 'Middle East Travel',
      publishedAt: '2025-04-30T14:00:00Z',
      snippet: 'Dubai will host a spectacular Festival of Lights this winter, featuring installations from international artists.',
      category: 'Events',
      country: 'UAE',
      saved: false
    }
  ],
  
  // Get all news articles
  async getAllNews() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.mockNewsData);
      }, 300);
    });
  },
  
  // Search for news by keyword
  async searchNews(keyword) {
    return new Promise(resolve => {
      setTimeout(() => {
        const results = this.mockNewsData.filter(news => 
          news.title.toLowerCase().includes(keyword.toLowerCase()) ||
          news.snippet.toLowerCase().includes(keyword.toLowerCase())
        );
        
        resolve(results);
      }, 300);
    });
  },
  
  // Get news by country
  async getNewsByCountry(countryName) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Find news related to the country
        let results = this.mockNewsData.filter(news => 
          news.country.toLowerCase() === countryName.toLowerCase() ||
          news.country.toLowerCase().includes(countryName.toLowerCase()) ||
          countryName.toLowerCase().includes(news.country.toLowerCase())
        );
        
        // If no results, include global news
        if (results.length === 0) {
          results = this.mockNewsData.filter(news => news.country === 'Global');
        }
        
        // If still no results, just return some random news
        if (results.length === 0) {
          results = this.mockNewsData.slice(0, 3);
        }
        
        // Generate a "fresh" news article specific to the country
        const freshNews = {
          id: 999,
          title: `Latest Travel Updates for ${countryName}`,
          source: 'Wanderlust Compass',
          publishedAt: new Date().toISOString(),
          snippet: `Stay updated with the latest travel information, safety guidelines, and tourist attractions for your trip to ${countryName}.`,
          category: 'Travel Updates',
          country: countryName,
          saved: false
        };
        
        results.unshift(freshNews);
        resolve(results);
      }, 300);
    });
  }
};
