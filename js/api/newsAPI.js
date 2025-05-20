
// News API module
export const newsAPI = {
  // Mock news data
  mockNewsData: [
    {
      id: '1',
      title: 'New Travel Restrictions Lifted for Popular Tourist Destinations',
      source: 'Travel Weekly',
      publishedAt: '2025-04-22T14:30:00Z',
      snippet: 'Several countries have announced the removal of travel restrictions, opening doors for tourists after years of limited access.',
      url: '#',
      category: 'Travel Alerts',
      saved: true
    },
    {
      id: '2',
      title: 'The Hidden Beaches of Southeast Asia You Need to Visit',
      source: 'Wanderlust Magazine',
      publishedAt: '2025-04-21T09:15:00Z',
      snippet: 'Discover untouched paradises away from the typical tourist spots in Thailand, Indonesia, and the Philippines.',
      url: '#',
      category: 'Destinations',
      saved: true
    },
    {
      id: '3',
      title: 'Airlines Announce New Routes for Summer 2025',
      source: 'Aviation Today',
      publishedAt: '2025-04-20T16:45:00Z',
      snippet: 'Major airlines are expanding their networks with exciting new destinations for the upcoming summer season.',
      url: '#',
      category: 'Flight News',
      saved: true
    },
    {
      id: '4',
      title: 'Top 10 Budget-Friendly European Cities for 2025',
      source: 'Budget Travel',
      publishedAt: '2025-04-19T12:30:00Z',
      snippet: 'Explore Europe without breaking the bank with our guide to the most affordable cities to visit this year.',
      url: '#',
      category: 'Budget Travel',
      saved: false
    },
    {
      id: '5',
      title: 'New High-Speed Train Connects Major Tourist Destinations in Japan',
      source: 'Rail News',
      publishedAt: '2025-04-18T08:45:00Z',
      snippet: 'Japan launches a new bullet train service that makes it even easier for tourists to explore multiple cities in a single trip.',
      url: '#',
      category: 'Transportation',
      saved: false
    }
  ],
  
  // Country-specific news
  countryNewsMapping: {
    'Japan': [
      {
        id: 'jp1',
        title: 'Cherry Blossom Festival Dates Announced for 2026 in Japan',
        source: 'Japan Travel',
        publishedAt: '2025-04-22T10:30:00Z',
        snippet: 'Plan your visit to witness the spectacular cherry blossom season across Japan\'s major cities next year.',
        url: '#',
        category: 'Events',
        saved: false
      },
      {
        id: 'jp2',
        title: 'New Visa Process Makes Travel to Japan Easier for Tourists',
        source: 'Travel News',
        publishedAt: '2025-04-20T16:45:00Z',
        snippet: 'Japan has simplified its visa application process, allowing more visitors to experience the country\'s unique culture.',
        url: '#',
        category: 'Travel Alerts',
        saved: false
      }
    ],
    'France': [
      {
        id: 'fr1',
        title: 'Paris Unveils New Tourist App for Olympic Games Legacy',
        source: 'Tech Travel',
        publishedAt: '2025-04-21T14:00:00Z',
        snippet: 'A new smartphone app helps visitors navigate Paris and discover venues from the recent Olympic Games.',
        url: '#',
        category: 'Technology',
        saved: false
      },
      {
        id: 'fr2',
        title: 'France Reports Record Tourism Numbers in Wine Regions',
        source: 'Wine Enthusiast',
        publishedAt: '2025-04-19T09:15:00Z',
        snippet: 'Bordeaux, Burgundy, and Champagne are seeing unprecedented numbers of visitors interested in wine tourism experiences.',
        url: '#',
        category: 'Food & Drink',
        saved: false
      }
    ]
  },
  
  // Get all news articles
  async getAllNews() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockNewsData);
      }, 300);
    });
  },
  
  // Search for news by term
  async searchNews(searchTerm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = this.mockNewsData.filter(article => 
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          article.snippet.toLowerCase().includes(searchTerm.toLowerCase()) || 
          article.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (results.length > 0) {
          resolve(results);
        } else {
          // Generate mock results for search term
          resolve([
            {
              id: `search-${Date.now()}`,
              title: `Latest Travel Updates for ${searchTerm}`,
              source: 'Travel News Network',
              publishedAt: new Date().toISOString(),
              snippet: `Stay informed on the latest travel information about ${searchTerm}, including attractions, travel requirements, and local events.`,
              url: '#',
              category: 'Destinations',
              saved: false
            }
          ]);
        }
      }, 300);
    });
  },
  
  // Get news by country
  async getNewsByCountry(country) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if we have specific news for this country
        let countryNews = [];
        
        // Check exact match
        if (this.countryNewsMapping[country]) {
          countryNews = this.countryNewsMapping[country];
        } else {
          // Check if country name contains the search term
          const countryKey = Object.keys(this.countryNewsMapping).find(key => 
            key.toLowerCase().includes(country.toLowerCase()) || 
            country.toLowerCase().includes(key.toLowerCase())
          );
          
          if (countryKey) {
            countryNews = this.countryNewsMapping[countryKey];
          }
        }
        
        // If we don't have specific news, generate some
        if (countryNews.length === 0) {
          countryNews = [
            {
              id: `${country}-1`,
              title: `${country} Named Top Destination for 2025`,
              source: 'Travel Magazine',
              publishedAt: new Date().toISOString(),
              snippet: `${country} has been recognized as one of the must-visit destinations for travelers seeking authentic cultural experiences.`,
              url: '#',
              category: 'Destinations',
              saved: false
            },
            {
              id: `${country}-2`,
              title: `Hidden Gems in ${country} You Can't Miss`,
              source: 'Explorer Weekly',
              publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
              snippet: `Beyond the tourist hotspots, ${country} offers many lesser-known attractions that provide unique experiences for travelers.`,
              url: '#',
              category: 'Off the Beaten Path',
              saved: false
            }
          ];
        }
        
        resolve(countryNews);
      }, 300);
    });
  }
};
