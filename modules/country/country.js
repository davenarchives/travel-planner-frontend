
import { getTemplate } from '../../js/templates.js';

export const countryModule = {
  // Mock data for countries
  countryData: [
    {
      name: 'Japan',
      capital: 'Tokyo',
      population: '126.3 million',
      region: 'Asia',
      flag: '🇯🇵',
      tags: ['Bucket List', 'Cherry Blossoms']
    },
    {
      name: 'Italy',
      capital: 'Rome',
      population: '60.4 million',
      region: 'Europe',
      flag: '🇮🇹',
      tags: ['Food', 'History']
    },
    {
      name: 'New Zealand',
      capital: 'Wellington',
      population: '4.9 million',
      region: 'Oceania',
      flag: '🇳🇿',
      tags: ['Nature', 'Adventure']
    }
  ],
  
  init(container) {
    // Create the country module view
    const template = getTemplate('country-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadCountryData();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    // Add country button
    const addCountryBtn = document.getElementById('add-country-btn');
    if (addCountryBtn) {
      addCountryBtn.addEventListener('click', () => {
        const input = document.getElementById('country-search-input');
        if (input && input.value.trim() !== '') {
          this.addCountryCard(input.value);
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
  
  loadCountryData() {
    this.countryData.forEach(country => {
      this.addCountryCard(country.name, country);
    });
  },
  
  addCountryCard(name, data) {
    const countryCards = document.getElementById('country-cards');
    if (!countryCards) return;
    
    // Use provided data or generate placeholder data
    const country = data || {
      capital: 'Sample Capital',
      population: 'Unknown',
      region: 'Unknown',
      flag: '🏳️',
      tags: ['New']
    };
    
    const template = getTemplate('country-card-template');
    
    template.querySelector('.card-title').textContent = `${country.flag || ''} ${name}`;
    template.querySelector('.capital').textContent = country.capital;
    template.querySelector('.population').textContent = country.population;
    template.querySelector('.region').textContent = country.region;
    
    const tagsContainer = template.querySelector('.tags-container');
    country.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });
    
    // Add the card to the grid
    countryCards.appendChild(template);
  },
  
  handleDelete(card) {
    // In a real app, this would call an API to delete the data
    card.remove();
    console.log('Country card deleted');
  },
  
  handleEdit(card) {
    // In a real app, this would open an edit form
    const country = card.querySelector('.card-title').textContent;
    console.log(`Editing country card for ${country}`);
    
    // Simple demonstration - add a new tag
    const tagsContainer = card.querySelector('.tags-container');
    const newTags = ['Favorite', 'Must Visit', 'Budget Friendly', 'Family Friendly'];
    const randomTag = newTags[Math.floor(Math.random() * newTags.length)];
    
    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.textContent = randomTag;
    tagsContainer.appendChild(tagElement);
  }
};
