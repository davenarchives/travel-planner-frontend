
import { getTemplate } from '../templates.js';

export const newsModule = {
  // Mock data for news
  newsData: [
    {
      title: 'New Travel Restrictions Lifted for Popular Tourist Destinations',
      source: 'Travel Weekly',
      publishedAt: '2025-04-22T14:30:00Z',
      snippet: 'Several countries have announced the removal of travel restrictions, opening doors for tourists after years of limited access.',
      category: 'Travel Alerts',
      saved: true
    },
    {
      title: 'The Hidden Beaches of Southeast Asia You Need to Visit',
      source: 'Wanderlust Magazine',
      publishedAt: '2025-04-21T09:15:00Z',
      snippet: 'Discover untouched paradises away from the typical tourist spots in Thailand, Indonesia, and the Philippines.',
      category: 'Destinations',
      saved: true
    },
    {
      title: 'Airlines Announce New Routes for Summer 2025',
      source: 'Aviation Today',
      publishedAt: '2025-04-20T16:45:00Z',
      snippet: 'Major airlines are expanding their networks with exciting new destinations for the upcoming summer season.',
      category: 'Flight News',
      saved: true
    }
  ],
  
  init(container) {
    // Create the news module view
    const template = getTemplate('news-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadNewsData();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    // Add search button
    const searchNewsBtn = document.getElementById('search-news-btn');
    if (searchNewsBtn) {
      searchNewsBtn.addEventListener('click', () => {
        const input = document.getElementById('news-search-input');
        if (input && input.value.trim() !== '') {
          this.addNewsCard(input.value);
          input.value = '';
        }
      });
    }
    
    // Enter key in input field
    const newsInput = document.getElementById('news-search-input');
    if (newsInput) {
      newsInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          document.getElementById('search-news-btn')?.click();
        }
      });
    }
    
    // Handle save article button (event delegation)
    document.addEventListener('click', (event) => {
      if (event.target.closest('.save-article-button')) {
        const button = event.target.closest('.save-article-button');
        button.textContent = 'Saved';
        button.disabled = true;
        button.style.opacity = '0.5';
      }
    });
  },
  
  loadNewsData() {
    this.newsData.forEach(news => {
      this.addNewsCard(null, news);
    });
  },
  
  addNewsCard(searchTerm, newsItem) {
    const newsCards = document.getElementById('news-cards');
    if (!newsCards) return;
    
    let news;
    
    if (newsItem) {
      news = newsItem;
    } else {
      // Generate mock news based on search term
      news = {
        title: `${searchTerm} - Latest Updates and Information`,
        source: 'Travel News Network',
        publishedAt: new Date().toISOString(),
        snippet: `The latest information about ${searchTerm} that travelers need to know before planning their next trip.`,
        category: 'Search Results',
        saved: false
      };
    }
    
    const template = getTemplate('news-card-template');
    
    template.querySelector('.card-title').textContent = news.title;
    template.querySelector('.news-source').textContent = news.source;
    template.querySelector('.news-category').textContent = news.category;
    template.querySelector('.news-snippet').textContent = news.snippet;
    template.querySelector('.published-date').textContent = `Published: ${new Date(news.publishedAt).toLocaleDateString()}`;
    
    // Handle saved state
    if (news.saved) {
      const saveButton = template.querySelector('.save-article-button');
      saveButton.textContent = 'Saved';
      saveButton.disabled = true;
      saveButton.style.opacity = '0.5';
    }
    
    // Add to top of list for search results
    if (searchTerm) {
      newsCards.insertBefore(template, newsCards.firstChild);
    } else {
      newsCards.appendChild(template);
    }
  },
  
  handleDelete(card) {
    // In a real app, this would call an API to delete the data
    card.remove();
    console.log('News card deleted');
  },
  
  handleEdit(card) {
    // In a real app, this would open an edit form
    const title = card.querySelector('.card-title').textContent;
    console.log(`Editing news card: ${title}`);
    
    // Simple demonstration - update the snippet
    const snippetElement = card.querySelector('.news-snippet');
    snippetElement.textContent = 'This article has been updated with the latest information from our editors.';
  }
};
