
import { countryAPI } from '../api/countryAPI.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const countryModule = {
  // Initialize the country module
  init(container) {
    // Create the country module view
    const template = getTemplate('country-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadCountryData();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  // Set up event listeners for the country module
  setupEventListeners() {
    // Add country button
    const addCountryBtn = document.getElementById('add-country-btn');
    if (addCountryBtn) {
      addCountryBtn.addEventListener('click', () => {
        const input = document.getElementById('country-search-input');
        if (input && input.value.trim() !== '') {
          this.addCountry(input.value);
          input.value = '';
        }
      });
    }
    
    // Enter key in input field
    const countryInput = document.getElementById('country-search-input');
    if (countryInput) {
      countryInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          document.getElementById('add-country-btn')?.click();
        }
      });
    }
  },
  
  // Load initial country data
  loadCountryData() {
    // Initial countries to load
    const countries = ['Japan', 'Italy', 'New Zealand'];
    
    // Get data for each country
    countries.forEach(country => {
      this.addCountry(country);
    });
  },
  
  // Add a country to the explorer
  addCountry(countryName) {
    const countryCards = document.getElementById('country-cards');
    if (!countryCards) return;
    
    // Get country data from API
    countryAPI.getCountryInfo(countryName)
      .then(country => {
        const card = document.importNode(document.getElementById('country-card-template').content, true);
        
        card.querySelector('.card-title').textContent = `${country.flag || ''} ${country.name}`;
        card.querySelector('.capital').textContent = country.capital;
        card.querySelector('.population').textContent = country.population;
        card.querySelector('.region').textContent = country.region;
        
        const tagsContainer = card.querySelector('.tags-container');
        country.tags.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.className = 'tag';
          tagElement.textContent = tag;
          tagsContainer.appendChild(tagElement);
        });
        
        // Generate a unique ID for the country
        const countryId = `country-${country.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
        const countryCard = card.querySelector('.card');
        countryCard.dataset.countryId = countryId;
        
        // Check if already bookmarked
        const bookmarkedCountries = JSON.parse(localStorage.getItem('bookmarkedCountries') || '[]');
        const isBookmarked = bookmarkedCountries.some(c => c.name === country.name);
        
        if (isBookmarked) {
          const bookmarkButton = card.querySelector('.bookmark-button');
          bookmarkButton.classList.add('active');
          bookmarkButton.querySelector('i').classList.add('active');
        }
        
        countryCards.appendChild(card);
      })
      .catch(error => {
        console.error('Error loading country data:', error);
      });
  },
  
  // Handle delete button click
  handleDelete(card) {
    card.remove();
    
    // Remove from bookmarks if bookmarked
    const countryId = card.dataset.countryId;
    if (countryId) {
      const bookmarkedCountries = JSON.parse(localStorage.getItem('bookmarkedCountries') || '[]');
      const updatedBookmarks = bookmarkedCountries.filter(c => c.countryId !== countryId);
      localStorage.setItem('bookmarkedCountries', JSON.stringify(updatedBookmarks));
    }
  },
  
  // Handle bookmark button click
  handleBookmark(card) {
    const countryId = card.dataset.countryId;
    const nameWithFlag = card.querySelector('.card-title').textContent;
    const nameParts = nameWithFlag.split(' ');
    const flag = nameParts.length > 1 && nameParts[0].length <= 4 ? nameParts[0] : '';
    const name = flag ? nameWithFlag.substring(flag.length).trim() : nameWithFlag;
    const capital = card.querySelector('.capital').textContent;
    const population = card.querySelector('.population').textContent;
    const region = card.querySelector('.region').textContent;
    const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);
    
    if (!countryId) return;
    
    const bookmarkedCountries = JSON.parse(localStorage.getItem('bookmarkedCountries') || '[]');
    const bookmarkButton = card.querySelector('.bookmark-button');
    
    // Check if already bookmarked
    const bookmarkIndex = bookmarkedCountries.findIndex(c => c.countryId === countryId);
    
    if (bookmarkIndex >= 0) {
      // Remove from bookmarks
      bookmarkedCountries.splice(bookmarkIndex, 1);
      bookmarkButton.classList.remove('active');
      bookmarkButton.querySelector('i').classList.remove('active');
    } else {
      // Add to bookmarks
      bookmarkedCountries.push({
        countryId,
        name,
        flag,
        capital,
        population,
        region,
        tags
      });
      bookmarkButton.classList.add('active');
      bookmarkButton.querySelector('i').classList.add('active');
    }
    
    // Save updated bookmarks to localStorage
    localStorage.setItem('bookmarkedCountries', JSON.stringify(bookmarkedCountries));
  }
};
