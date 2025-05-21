
// Import API modules
import { weatherAPI } from './api/weatherAPI.js';
import { countryAPI } from './api/countryAPI.js';
import { currencyAPI } from './api/currencyAPI.js';
import { newsAPI } from './api/newsAPI.js';
import { flightAPI } from './api/flightAPI.js';

// Import module handlers
import { dashboardModule } from './modules/dashboard.js';
import { weatherModule } from './modules/weather.js';
import { countryModule } from './modules/country.js';
import { currencyModule } from './modules/currency.js';
import { newsModule } from './modules/news.js';
import { flightModule } from './modules/flight.js';
import { bookmarksModule } from './modules/bookmarks.js';

// Import utility functions
import { loadTemplates, getTemplate } from './utils/templatesUtil.js';

// Check if user is logged in
function checkUserLogin() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load all HTML templates
  loadTemplates().then(() => {
    // Check if user is logged in
    if (checkUserLogin()) {
      showApp();
    } else {
      showLoginForm();
    }
  });
});

// Show login form
function showLoginForm() {
  const loginContainer = document.getElementById('login-container');
  const appContainer = document.getElementById('app-container');
  
  loginContainer.classList.remove('hidden');
  appContainer.classList.add('hidden');
  
  // Set up login button handler
  const loginButton = document.getElementById('login-button');
  loginButton.addEventListener('click', handleLogin);
  
  // Handle Enter key press in login form
  const passwordInput = document.getElementById('password');
  passwordInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  });
}

// Handle login attempt
function handleLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('login-error');
  
  // Check against hardcoded credentials
  if (username === 'user' && password === 'travel123') {
    // Store login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    showApp();
  } else {
    // Show error message
    loginError.classList.remove('hidden');
    
    // Clear password field
    document.getElementById('password').value = '';
  }
}

// Show the main application
function showApp() {
  const loginContainer = document.getElementById('login-container');
  const appContainer = document.getElementById('app-container');
  
  loginContainer.classList.add('hidden');
  appContainer.classList.remove('hidden');
  
  // Load initial module
  loadModule('dashboard');
  
  // Add event listeners to sidebar menu items
  setupNavigation();
  
  // Global event delegation for card actions
  setupEventDelegation();
  
  // Set up country search functionality
  setupCountrySearch();
  
  // Set up logout button
  setupLogout();
}

// Set up logout functionality
function setupLogout() {
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      // Clear login state
      localStorage.removeItem('isLoggedIn');
      
      // Show login form
      showLoginForm();
    });
  }
}

// Module mapping
const modules = {
  'dashboard': dashboardModule,
  'weather': weatherModule,
  'country': countryModule,
  'currency': currencyModule,
  'news': newsModule,
  'flight': flightModule,
  'bookmarks': bookmarksModule
};

// Load a specific module
function loadModule(moduleId) {
  const moduleContent = document.getElementById('module-content');
  const moduleTitle = document.getElementById('module-title');
  const moduleDescription = document.getElementById('module-description');
  const searchResults = document.getElementById('country-search-results');
  
  // Hide search results and show module content
  searchResults.classList.add('hidden');
  moduleContent.classList.remove('hidden');
  
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
    'flight': 'Flight Search',
    'bookmarks': 'Bookmarked Flights'
  };
  
  const moduleDescriptions = {
    'dashboard': 'Your travel planning dashboard with all modules',
    'weather': 'Track weather for your travel destinations',
    'country': 'Explore information about countries',
    'currency': 'Convert between different currencies',
    'news': 'Stay updated with travel news',
    'flight': 'Find and save flight options',
    'bookmarks': 'View your bookmarked flights'
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
      const moduleId = this.closest('.sidebar-menu-item').dataset.module;
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
    
    // Handle tab clicks
    if (target.closest('.tab-item')) {
      const tabItem = target.closest('.tab-item');
      const tabId = tabItem.dataset.tab;
      
      // Remove active class from all tabs
      document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      // Add active class to selected tab and its content
      tabItem.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    }
  });
}

// Set up country search functionality
function setupCountrySearch() {
  const searchInput = document.getElementById('country-search');
  const searchButton = document.getElementById('search-button');
  
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      performSearch();
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        performSearch();
      }
    });
  }
}

// Perform country search
function performSearch() {
  const searchInput = document.getElementById('country-search');
  const searchTerm = searchInput.value.trim();
  
  if (searchTerm) {
    showCountryResults(searchTerm);
  }
}

// Show country search results
function showCountryResults(country) {
  const moduleContent = document.getElementById('module-content');
  const searchResults = document.getElementById('country-search-results');
  const resultsTitle = document.getElementById('results-title');
  const resultsDescription = document.getElementById('results-description');
  
  // Hide module content and show search results
  moduleContent.classList.add('hidden');
  searchResults.classList.remove('hidden');
  
  // Update title and description
  resultsTitle.textContent = `Travel Information for ${country}`;
  resultsDescription.textContent = `Explore all travel data related to ${country}`;
  
  // Load data for each tab
  loadCountryWeatherData(country);
  loadCountryInfoData(country);
  loadCountryCurrencyData(country);
  loadCountryNewsData(country);
  loadCountryFlightData(country);
  
  // Reset tabs to weather tab
  document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  document.querySelector('.tab-item[data-tab="weather"]').classList.add('active');
  document.getElementById('weather-tab').classList.add('active');
}

// Load weather data for country
function loadCountryWeatherData(country) {
  const container = document.getElementById('country-weather-content');
  container.innerHTML = '';
  
  // Use the weather API to get data
  weatherAPI.getWeatherByCountry(country)
    .then(weatherData => {
      if (weatherData.length > 0) {
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';
        
        weatherData.forEach(weather => {
          const card = createWeatherCard(weather);
          cardGrid.appendChild(card);
        });
        
        container.appendChild(cardGrid);
      } else {
        container.innerHTML = `<p class="no-data">No weather data available for ${country}.</p>`;
      }
    })
    .catch(error => {
      console.error('Error loading weather data:', error);
      container.innerHTML = `<p class="error-message">Error loading weather data. Please try again later.</p>`;
    });
}

// Load country info data
function loadCountryInfoData(country) {
  const container = document.getElementById('country-info-content');
  container.innerHTML = '';
  
  // Use the country API to get data
  countryAPI.getCountryInfo(country)
    .then(countryData => {
      if (countryData) {
        const card = createCountryCard(countryData);
        container.appendChild(card);
      } else {
        container.innerHTML = `<p class="no-data">No information available for ${country}.</p>`;
      }
    })
    .catch(error => {
      console.error('Error loading country data:', error);
      container.innerHTML = `<p class="error-message">Error loading country data. Please try again later.</p>`;
    });
}

// Load currency data for country
function loadCountryCurrencyData(country) {
  const container = document.getElementById('country-currency-content');
  container.innerHTML = '';
  
  // Use the currency API to get data
  currencyAPI.getCurrencyByCountry(country)
    .then(currencyData => {
      if (currencyData && currencyData.length > 0) {
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';
        
        currencyData.forEach(currency => {
          const card = createCurrencyCard(currency);
          cardGrid.appendChild(card);
        });
        
        container.appendChild(cardGrid);
      } else {
        container.innerHTML = `<p class="no-data">No currency data available for ${country}.</p>`;
      }
    })
    .catch(error => {
      console.error('Error loading currency data:', error);
      container.innerHTML = `<p class="error-message">Error loading currency data. Please try again later.</p>`;
    });
}

// Load news data for country
function loadCountryNewsData(country) {
  const container = document.getElementById('country-news-content');
  container.innerHTML = '';
  
  // Use the news API to get data
  newsAPI.getNewsByCountry(country)
    .then(newsData => {
      if (newsData && newsData.length > 0) {
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid news-grid';
        
        newsData.forEach(news => {
          const card = createNewsCard(news);
          cardGrid.appendChild(card);
        });
        
        container.appendChild(cardGrid);
      } else {
        container.innerHTML = `<p class="no-data">No news available for ${country}.</p>`;
      }
    })
    .catch(error => {
      console.error('Error loading news data:', error);
      container.innerHTML = `<p class="error-message">Error loading news data. Please try again later.</p>`;
    });
}

// Load flight data for country
function loadCountryFlightData(country) {
  const container = document.getElementById('country-flight-content');
  container.innerHTML = '';
  
  // Use the flight API to get data
  flightAPI.getFlightsByDestination(country)
    .then(flightData => {
      if (flightData && flightData.length > 0) {
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';
        
        flightData.forEach(flight => {
          const card = createFlightCard(flight);
          cardGrid.appendChild(card);
        });
        
        container.appendChild(cardGrid);
      } else {
        container.innerHTML = `<p class="no-data">No flight data available for ${country}.</p>`;
      }
    })
    .catch(error => {
      console.error('Error loading flight data:', error);
      container.innerHTML = `<p class="error-message">Error loading flight data. Please try again later.</p>`;
    });
}

// Helper functions for creating cards
function createWeatherCard(weather) {
  const template = document.getElementById('weather-card-template');
  const card = document.importNode(template.content, true).querySelector('.card');
  
  card.querySelector('.card-title').textContent = weather.city;
  card.querySelector('.weather-icon').innerHTML = `<i class="fas ${weather.icon}"></i>`;
  card.querySelector('.temperature').textContent = `${weather.temperature}°F`;
  card.querySelector('.condition').textContent = weather.condition;
  
  return card;
}

function createCountryCard(country) {
  const template = document.getElementById('country-card-template');
  const card = document.importNode(template.content, true).querySelector('.card');
  
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
  
  return card;
}

function createCurrencyCard(currency) {
  const template = document.getElementById('currency-card-template');
  const card = document.importNode(template.content, true).querySelector('.card');
  
  card.dataset.rate = currency.rate;
  card.querySelector('.card-title').textContent = `${currency.fromCurrency} to ${currency.toCurrency}`;
  
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'JPY': '¥',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'CNY': '¥',
    'INR': '₹'
  };
  
  card.querySelector('.rate-info').textContent = `${symbols[currency.fromCurrency] || currency.fromCurrency}1 = ${symbols[currency.toCurrency] || currency.toCurrency}${currency.rate.toFixed(4)}`;
  card.querySelector('.from-currency-code').textContent = currency.fromCurrency;
  card.querySelector('.to-currency-code').textContent = currency.toCurrency;
  
  const amount = 100;
  const convertedAmount = (amount * currency.rate).toFixed(2);
  card.querySelector('.converted-amount').textContent = convertedAmount;
  
  card.querySelector('.last-updated').textContent = `Last updated: ${new Date().toLocaleString()}`;
  
  return card;
}

function createNewsCard(news) {
  const template = document.getElementById('news-card-template');
  const card = document.importNode(template.content, true).querySelector('.card');
  
  card.querySelector('.card-title').textContent = news.title;
  card.querySelector('.news-source').textContent = news.source;
  card.querySelector('.news-category').textContent = news.category;
  card.querySelector('.news-snippet').textContent = news.snippet;
  card.querySelector('.published-date').textContent = `Published: ${new Date(news.publishedAt).toLocaleDateString()}`;
  
  // Handle saved state
  if (news.saved) {
    const saveButton = card.querySelector('.save-article-button');
    saveButton.textContent = 'Saved';
    saveButton.disabled = true;
    saveButton.style.opacity = '0.5';
  }
  
  return card;
}

function createFlightCard(flight) {
  const template = document.getElementById('flight-card-template');
  const card = document.importNode(template.content, true).querySelector('.card');
  
  card.querySelector('.card-title').textContent = `Flight ${flight.origin} - ${flight.destination}`;
  card.querySelector('.origin').textContent = flight.origin;
  card.querySelector('.destination').textContent = flight.destination;
  
  // Format dates
  const formattedDepartDate = flight.departureDate ? new Date(flight.departureDate).toLocaleDateString() : '';
  let dateText = `Depart: ${formattedDepartDate}`;
  
  if (flight.returnDate) {
    const formattedReturnDate = new Date(flight.returnDate).toLocaleDateString();
    dateText += ` · Return: ${formattedReturnDate}`;
  }
  
  card.querySelector('.date-info').textContent = dateText;
  card.querySelector('.price').textContent = flight.price;
  card.querySelector('.airline-name').textContent = flight.airline;
  
  return card;
}

// Get current active module
function getCurrentModule() {
  const activeButton = document.querySelector('.sidebar-menu-button.active');
  if (activeButton) {
    return activeButton.closest('.sidebar-menu-item').dataset.module;
  }
  return 'dashboard';
}

// Export for other modules
export { loadModule };
