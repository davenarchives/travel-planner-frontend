
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
        
        countryCards.appendChild(card);
      })
      .catch(error => {
        console.error('Error loading country data:', error);
      });
  },
  
  // Handle delete button click
  handleDelete(card) {
    card.remove();
  },
  
  // Handle edit button click
  handleEdit(card) {
    // Add a random tag to the country card
    const tagsContainer = card.querySelector('.tags-container');
    const newTags = ['Favorite', 'Must Visit', 'Budget Friendly', 'Family Friendly'];
    const randomTag = newTags[Math.floor(Math.random() * newTags.length)];
    
    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.textContent = randomTag;
    tagsContainer.appendChild(tagElement);
  }
};
