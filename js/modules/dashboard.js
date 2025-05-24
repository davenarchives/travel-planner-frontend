// js/modules/dashboard.js

import { loadModule } from '../app.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const dashboardModule = {
  // Initialize the dashboard module
  init(container) {
    // Create the dashboard view
    const template = getTemplate('dashboard-template');
    container.appendChild(template);
    
    // Load module data
    this.loadDashboardData();
  },
  
  // Load dashboard data
  loadDashboardData() {
    const moduleGrid = document.querySelector('.module-grid');
    if (!moduleGrid) return;
    
    const modules = [
      {
        id: 'weather',
        title: 'Weather Tracking',
        type: 'weather',
        description: 'Monitor weather conditions for your favorite destinations.',
        icon: 'fa-cloud',
        count: this.getSavedItemsCount('weather')
      },
      {
        id: 'country',
        title: 'Country Explorer',
        type: 'country',
        description: 'Save and compare details about countries you plan to visit.',
        icon: 'fa-flag',
        count: this.getSavedItemsCount('country')
      },
      {
        id: 'currency',
        title: 'Currency Conversion',
        type: 'currency',
        description: 'Track exchange rates for your travel destinations.',
        icon: 'fa-money-bill',
        count: this.getSavedItemsCount('currency')
      },
      {
        id: 'news',
        title: 'Travel News',
        type: 'news',
        description: 'Stay updated with the latest travel news and alerts.',
        icon: 'fa-newspaper',
        count: this.getSavedItemsCount('news')
      },
      {
        id: 'flight',
        title: 'Flight Search',
        type: 'flight',
        description: 'Find and save flight options for your upcoming trips.',
        icon: 'fa-plane',
        count: this.getSavedItemsCount('flight')
      },
      {
        id: 'bookmark',
        title: 'Bookmarked Items',
        type: 'bookmark',
        description: 'View and manage your saved items.',
        icon: 'fa-bookmark',
        count: this.getBookmarkCount()
      }
    ];
    
    modules.forEach(module => {
      this.createModuleCard(moduleGrid, module);
    });
  },
  
  // Get saved items count for each module
  getSavedItemsCount(moduleType) {
    switch(moduleType) {
      case 'weather':
        return JSON.parse(localStorage.getItem('savedWeather') || '[]').length;
      case 'country':
        return JSON.parse(localStorage.getItem('savedCountries') || '[]').length;
      case 'currency':
        return JSON.parse(localStorage.getItem('savedCurrencies') || '[]').length;
      case 'news':
        return JSON.parse(localStorage.getItem('savedNews') || '[]').length;
      case 'flight':
        return JSON.parse(localStorage.getItem('savedFlights') || '[]').length;
      default:
        return 0;
    }
  },
  
  // Get bookmark count from localStorage
  getBookmarkCount() {
    const bookmarkedFlights = JSON.parse(localStorage.getItem('bookmarkedFlights') || '[]');
    const bookmarkedWeather = JSON.parse(localStorage.getItem('bookmarkedWeather') || '[]');
    const bookmarkedCountries = JSON.parse(localStorage.getItem('bookmarkedCountries') || '[]');
    const bookmarkedCurrencies = JSON.parse(localStorage.getItem('bookmarkedCurrencies') || '[]');
    const bookmarkedNews = JSON.parse(localStorage.getItem('bookmarkedNews') || '[]');
    
    return bookmarkedFlights.length + bookmarkedWeather.length + bookmarkedCountries.length + bookmarkedCurrencies.length + bookmarkedNews.length;
  },
  
  // Create a module card
  createModuleCard(container, module) {
    const template = getTemplate('module-card-template');
    const card = template.querySelector('.module-card');
    
    card.dataset.moduleType = module.id;
    
    const title = card.querySelector('.module-card-title');
    title.textContent = module.title;
    
    const content = card.querySelector('.module-card-content');
    content.innerHTML = `
      <div class="module-icon ${module.id}-icon">
        <i class="fas ${module.icon}"></i>
      </div>
      <p class="module-description">${module.description}</p>
      <div class="module-count">${module.count} saved items</div>
    `;
    
    // Handle view button click
    const viewButton = card.querySelector('.view-button');
    if (viewButton) {
      viewButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click event from triggering
        loadModule(module.id);
      });
  }
    
    // Make the entire card clickable
    card.addEventListener('click', () => {
      loadModule(module.id);
    });
    
    // Add keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadModule(module.id);
      }
    });
    
    container.appendChild(card);
  }
};