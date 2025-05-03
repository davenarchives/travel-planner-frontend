
// Import module handlers
import { dashboardModule } from './modules/dashboard.js';
import { weatherModule } from './modules/weather.js';
import { countryModule } from './modules/country.js';
import { currencyModule } from './modules/currency.js';
import { newsModule } from './modules/news.js';
import { flightModule } from './modules/flight.js';

// Import UI templates
import { loadTemplates } from './templates.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load all HTML templates
  loadTemplates().then(() => {
    // Load initial module
    loadModule('dashboard');
    
    // Add event listeners to sidebar menu items
    setupNavigation();
    
    // Global event delegation for card actions
    setupEventDelegation();
  });
});

// Module mapping
const modules = {
  'dashboard': dashboardModule,
  'weather': weatherModule,
  'country': countryModule,
  'currency': currencyModule,
  'news': newsModule,
  'flight': flightModule
};

// Load a specific module
function loadModule(moduleId) {
  const moduleContent = document.getElementById('module-content');
  const moduleTitle = document.getElementById('module-title');
  const moduleDescription = document.getElementById('module-description');
  
  // Update active state in sidebar
  document.querySelectorAll('.sidebar-menu-button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-module="${moduleId}"] .sidebar-menu-button`).classList.add('active');
  
  // Update title and description based on module
  const moduleTitles = {
    'dashboard': 'Dashboard Overview',
    'weather': 'Weather Tracking',
    'country': 'Country Explorer',
    'currency': 'Currency Conversion',
    'news': 'Travel News',
    'flight': 'Flight Search'
  };
  
  const moduleDescriptions = {
    'dashboard': 'Your travel planning dashboard with all modules',
    'weather': 'Manage your weather data with full CRUD capabilities',
    'country': 'Manage your country data with full CRUD capabilities',
    'currency': 'Manage your currency data with full CRUD capabilities',
    'news': 'Manage your news data with full CRUD capabilities',
    'flight': 'Manage your flight data with full CRUD capabilities'
  };
  
  moduleTitle.textContent = moduleTitles[moduleId];
  moduleDescription.textContent = moduleDescriptions[moduleId];
  
  // Clear module content
  moduleContent.innerHTML = '';
  
  // Initialize module
  if (modules[moduleId]) {
    modules[moduleId].init(moduleContent);
  }
}

// Set up sidebar navigation
function setupNavigation() {
  const menuItems = document.querySelectorAll('.sidebar-menu-button');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Get module name and load it
      const moduleId = this.parentElement.dataset.module;
      loadModule(moduleId);
    });
  });
}

// Set up global event delegation
function setupEventDelegation() {
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    // Handle view button clicks in dashboard
    if (target.closest('.view-button')) {
      const moduleCard = target.closest('.module-card');
      const moduleType = moduleCard.dataset.moduleType;
      loadModule(moduleType);
    }
    
    // Handle delete button clicks
    if (target.closest('.delete-button')) {
      const card = target.closest('.card');
      const moduleId = getCurrentModule();
      
      if (modules[moduleId] && modules[moduleId].handleDelete) {
        modules[moduleId].handleDelete(card);
      } else {
        card.remove();
      }
    }
    
    // Handle edit button clicks
    if (target.closest('.edit-button')) {
      const card = target.closest('.card');
      const moduleId = getCurrentModule();
      
      if (modules[moduleId] && modules[moduleId].handleEdit) {
        modules[moduleId].handleEdit(card);
      }
    }
  });
}

// Get current active module
function getCurrentModule() {
  const activeButton = document.querySelector('.sidebar-menu-button.active');
  if (activeButton) {
    return activeButton.parentElement.dataset.module;
  }
  return 'dashboard';
}

// Export for other modules
export { loadModule };
