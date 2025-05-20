import { newsAPI } from '../api/newsAPI.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const newsModule = {
  // Initialize the news module
  init(container) {
    // Create the news module view
    const template = getTemplate('news-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadNewsData();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  // Set up event listeners for the news module
  setupEventListeners() {
    // Search news button
    const searchNewsBtn = document.getElementById('search-news-btn');
    if (searchNewsBtn) {
      searchNewsBtn.addEventListener('click', () => {
        const input = document.getElementById('news-search-input');
        if (input && input.value.trim() !== '') {
          this.searchNews(input.value);
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
    
    // Save article button (using event delegation)
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('save-article-button')) {
        const button = event.target;
        button.textContent = 'Saved';
        button.disabled = true;
        button.style.opacity = '0.5';
      }
    });
  },
  
  // Load initial news data
  loadNewsData() {
    // Get latest travel news
    newsAPI.getAllNews()
      .then(news => {
        // Display the first 3 news articles
        news.slice(0, 3).forEach(article => {
          this.addNewsCard(article);
        });
      })
      .catch(error => {
        console.error('Error loading news data:', error);
      });
  },
  
  // Search for news
  searchNews(searchTerm) {
    const newsCards = document.getElementById('news-cards');
    if (!newsCards) return;
    
    // Search for news via API
    newsAPI.searchNews(searchTerm)
      .then(results => {
        // Clear existing search results (keep saved news)
        const searchResults = newsCards.querySelectorAll('.card:not(.saved)');
        searchResults.forEach(card => card.remove());
        
        // Add new search results at the top
        if (results.length > 0) {
          results.forEach(article => {
            this.addNewsCard(article, true);
          });
        } else {
          // Add a message if no results found
          const noResultsMsg = document.createElement('p');
          noResultsMsg.className = 'no-results';
          noResultsMsg.textContent = `No news found for "${searchTerm}". Try another search term.`;
          newsCards.insertBefore(noResultsMsg, newsCards.firstChild);
          
          // Remove message after 3 seconds
          setTimeout(() => {
            noResultsMsg.remove();
          }, 3000);
        }
      })
      .catch(error => {
        console.error('Error searching news:', error);
      });
  },
  
  // Add a news card
  addNewsCard(article, prepend = false) {
    const newsCards = document.getElementById('news-cards');
    if (!newsCards) return;
    
    const card = document.importNode(document.getElementById('news-card-template').content, true);
    
    card.querySelector('.card-title').textContent = article.title;
    card.querySelector('.news-source').textContent = article.source;
    card.querySelector('.news-category').textContent = article.category;
    card.querySelector('.news-snippet').textContent = article.snippet;
    card.querySelector('.published-date').textContent = `Published: ${new Date(article.publishedAt).toLocaleDateString()}`;
    
    // Handle saved state
    if (article.saved) {
      const newsCard = card.querySelector('.card');
      newsCard.classList.add('saved');
      
      const saveButton = card.querySelector('.save-article-button');
      saveButton.textContent = 'Saved';
      saveButton.disabled = true;
      saveButton.style.opacity = '0.5';
    }
    
    // Add to top of list for search results, otherwise add to end
    if (prepend) {
      newsCards.insertBefore(card, newsCards.firstChild);
    } else {
      newsCards.appendChild(card);
    }
  },
  
  // Handle delete button click
  handleDelete(card) {
    card.remove();
  },
  
  // Handle edit button click
  handleEdit(card) {
    // Toggle save state
    const saveButton = card.querySelector('.save-article-button');
    if (saveButton.disabled) {
      // Unsave
      saveButton.textContent = 'Save Article';
      saveButton.disabled = false;
      saveButton.style.opacity = '1';
      card.classList.remove('saved');
    } else {
      // Save
      saveButton.textContent = 'Saved';
      saveButton.disabled = true;
      saveButton.style.opacity = '0.5';
      card.classList.add('saved');
    }
  }
};
