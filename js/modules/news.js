
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
        const card = button.closest('.card');
        
        button.textContent = 'Saved';
        button.disabled = true;
        button.style.opacity = '0.5';
        
        // Also activate the bookmark button
        if (card) {
          const bookmarkButton = card.querySelector('.bookmark-button');
          if (bookmarkButton) {
            bookmarkButton.classList.add('active');
            bookmarkButton.querySelector('i')?.classList.add('active');
            
            // Trigger bookmarking
            this.handleBookmark(card);
          }
        }
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
          // Remove the 'saved' property to prevent auto-bookmarking
          const newsArticle = {...article};
          delete newsArticle.saved;
          this.addNewsCard(newsArticle);
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
    
    // Generate a unique ID for the news
    const newsId = `news-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newsCard = card.querySelector('.card');
    newsCard.dataset.newsId = newsId;
    
    // Check if already bookmarked
    const bookmarkedNews = JSON.parse(localStorage.getItem('bookmarkedNews') || '[]');
    const isBookmarked = article.saved || bookmarkedNews.some(n => n.title === article.title);
    
    // Handle saved state
    if (isBookmarked) {
      newsCard.classList.add('saved');
      
      const saveButton = card.querySelector('.save-article-button');
      saveButton.textContent = 'Saved';
      saveButton.disabled = true;
      saveButton.style.opacity = '0.5';
      
      const bookmarkButton = card.querySelector('.bookmark-button');
      bookmarkButton.classList.add('active');
      bookmarkButton.querySelector('i').classList.add('active');
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
    
    // Remove from bookmarks if bookmarked
    const newsId = card.dataset.newsId;
    if (newsId) {
      const bookmarkedNews = JSON.parse(localStorage.getItem('bookmarkedNews') || '[]');
      const updatedBookmarks = bookmarkedNews.filter(n => n.newsId !== newsId);
      localStorage.setItem('bookmarkedNews', JSON.stringify(updatedBookmarks));
    }
  },
  
  // Handle bookmark button click
  handleBookmark(card) {
    const newsId = card.dataset.newsId;
    const title = card.querySelector('.card-title').textContent;
    const source = card.querySelector('.news-source').textContent;
    const category = card.querySelector('.news-category').textContent;
    const snippet = card.querySelector('.news-snippet').textContent;
    const publishedAt = card.querySelector('.published-date').textContent.replace('Published: ', '');
    
    if (!newsId) return;
    
    const bookmarkedNews = JSON.parse(localStorage.getItem('bookmarkedNews') || '[]');
    const bookmarkButton = card.querySelector('.bookmark-button');
    
    // Check if already bookmarked
    const bookmarkIndex = bookmarkedNews.findIndex(n => n.newsId === newsId);
    
    if (bookmarkIndex >= 0) {
      // Remove from bookmarks
      bookmarkedNews.splice(bookmarkIndex, 1);
      bookmarkButton.classList.remove('active');
      bookmarkButton.querySelector('i').classList.remove('active');
      
      // Also update save button
      const saveButton = card.querySelector('.save-article-button');
      if (saveButton) {
        saveButton.textContent = 'Save Article';
        saveButton.disabled = false;
        saveButton.style.opacity = '1';
      }
      
      card.classList.remove('saved');
    } else {
      // Add to bookmarks
      bookmarkedNews.push({
        newsId,
        title,
        source,
        category,
        snippet,
        publishedAt,
        saved: true
      });
      bookmarkButton.classList.add('active');
      bookmarkButton.querySelector('i').classList.add('active');
      
      // Also update save button
      const saveButton = card.querySelector('.save-article-button');
      if (saveButton) {
        saveButton.textContent = 'Saved';
        saveButton.disabled = true;
        saveButton.style.opacity = '0.5';
      }
      
      card.classList.add('saved');
    }
    
    // Save updated bookmarks to localStorage
    localStorage.setItem('bookmarkedNews', JSON.stringify(bookmarkedNews));
  }
};
