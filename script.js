
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load initial module
  loadModule('dashboard');
  
  // Add event listeners to sidebar menu items
  const menuItems = document.querySelectorAll('.sidebar-menu-button');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all menu items
      menuItems.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked menu item
      this.classList.add('active');
      
      // Get module name and load it
      const moduleId = this.parentElement.dataset.module;
      loadModule(moduleId);
    });
  });

  // Global event delegation for card actions
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    // Handle view button clicks in dashboard
    if (target.closest('.view-button')) {
      const moduleCard = target.closest('.module-card');
      const moduleType = moduleCard.dataset.moduleType;
      loadModule(moduleType);
      
      // Update sidebar active state
      menuItems.forEach(btn => btn.classList.remove('active'));
      document.querySelector(`[data-module="${moduleType}"] .sidebar-menu-button`).classList.add('active');
    }
    
    // Handle delete button clicks
    if (target.closest('.delete-button')) {
      const card = target.closest('.card');
      card.remove();
    }
    
    // Handle save article button
    if (target.closest('.save-article-button')) {
      const button = target.closest('.save-article-button');
      button.textContent = 'Saved';
      button.disabled = true;
      button.style.opacity = '0.5';
    }
  });
  
  // Add event listeners for form submissions
  setupFormHandlers();
});

// Load a specific module
function loadModule(moduleId) {
  const moduleContent = document.getElementById('module-content');
  const moduleTitle = document.getElementById('module-title');
  const moduleDescription = document.getElementById('module-description');
  
  // Update title and description based on module
  switch(moduleId) {
    case 'dashboard':
      moduleTitle.textContent = 'Dashboard Overview';
      moduleDescription.textContent = 'Your travel planning dashboard with all modules';
      break;
    case 'weather':
      moduleTitle.textContent = 'Weather Tracking';
      moduleDescription.textContent = 'Manage your weather data with full CRUD capabilities';
      break;
    case 'country':
      moduleTitle.textContent = 'Country Explorer';
      moduleDescription.textContent = 'Manage your country data with full CRUD capabilities';
      break;
    case 'currency':
      moduleTitle.textContent = 'Currency Conversion';
      moduleDescription.textContent = 'Manage your currency data with full CRUD capabilities';
      break;
    case 'news':
      moduleTitle.textContent = 'Travel News';
      moduleDescription.textContent = 'Manage your news data with full CRUD capabilities';
      break;
    case 'flight':
      moduleTitle.textContent = 'Flight Search';
      moduleDescription.textContent = 'Manage your flight data with full CRUD capabilities';
      break;
  }
  
  // Clear module content
  moduleContent.innerHTML = '';
  
  // Load appropriate template
  const template = document.getElementById(`${moduleId}-template`);
  if (template) {
    const content = template.content.cloneNode(true);
    moduleContent.appendChild(content);
    
    // Initialize module specific data
    initializeModuleData(moduleId);
  }
}

// Initialize data for specific modules
function initializeModuleData(moduleId) {
  switch(moduleId) {
    case 'dashboard':
      loadDashboardData();
      break;
    case 'weather':
      loadWeatherData();
      break;
    case 'country':
      loadCountryData();
      break;
    case 'currency':
      loadCurrencyData();
      break;
    case 'news':
      loadNewsData();
      break;
    case 'flight':
      loadFlightData();
      break;
  }
}

// Setup form handlers for each module
function setupFormHandlers() {
  // Add city for weather
  document.addEventListener('click', function(event) {
    if (event.target.id === 'add-city-btn') {
      const input = document.getElementById('weather-city-input');
      if (input && input.value.trim() !== '') {
        addWeatherCard(input.value);
        input.value = '';
      }
    }
    
    // Add country
    if (event.target.id === 'add-country-btn') {
      const input = document.getElementById('country-search-input');
      if (input && input.value.trim() !== '') {
        addCountryCard(input.value);
        input.value = '';
      }
    }
    
    // Add currency pair
    if (event.target.id === 'add-currency-pair-btn') {
      const fromCurrency = document.getElementById('from-currency').value;
      const toCurrency = document.getElementById('to-currency').value;
      addCurrencyCard(fromCurrency, toCurrency);
    }
    
    // Search news
    if (event.target.id === 'search-news-btn') {
      const input = document.getElementById('news-search-input');
      if (input && input.value.trim() !== '') {
        addNewsCard(input.value);
        input.value = '';
      }
    }
    
    // Search flights
    if (event.target.id === 'search-flights-btn') {
      const origin = document.getElementById('origin').value;
      const destination = document.getElementById('destination').value;
      const departureDate = document.getElementById('departure-date').value;
      const returnDate = document.getElementById('return-date').value;
      const passengers = document.getElementById('passengers').value;
      
      if (origin && destination && departureDate) {
        addFlightCard(origin, destination, departureDate, returnDate, passengers);
      }
    }
  });
  
  // Enter key for input fields
  document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const input = event.target;
      
      if (input.id === 'weather-city-input') {
        document.getElementById('add-city-btn').click();
      }
      
      if (input.id === 'country-search-input') {
        document.getElementById('add-country-btn').click();
      }
      
      if (input.id === 'news-search-input') {
        document.getElementById('search-news-btn').click();
      }
    }
  });
  
  // Update converted amount on currency card
  document.addEventListener('input', function(event) {
    if (event.target.classList.contains('amount-input')) {
      const card = event.target.closest('.currency-card');
      if (card) {
        const amount = parseFloat(event.target.value) || 0;
        const rate = parseFloat(card.dataset.rate) || 1;
        const convertedAmount = (amount * rate).toFixed(2);
        card.querySelector('.converted-amount').textContent = convertedAmount;
      }
    }
  });
}

// Dashboard module data
function loadDashboardData() {
  const moduleGrid = document.querySelector('.module-grid');
  if (!moduleGrid) return;
  
  const modules = [
    {
      id: 'weather',
      title: 'Weather Tracking',
      type: 'weather',
      description: 'Monitor weather conditions for your favorite destinations.',
      icon: 'fa-cloud',
      count: 3
    },
    {
      id: 'country',
      title: 'Country Explorer',
      type: 'country',
      description: 'Save and compare details about countries you plan to visit.',
      icon: 'fa-flag',
      count: 3
    },
    {
      id: 'currency',
      title: 'Currency Conversion',
      type: 'currency',
      description: 'Track exchange rates for your travel destinations.',
      icon: 'fa-money-bill',
      count: 3
    },
    {
      id: 'news',
      title: 'Travel News',
      type: 'news',
      description: 'Stay updated with the latest travel news and alerts.',
      icon: 'fa-newspaper',
      count: 3
    },
    {
      id: 'flight',
      title: 'Flight Search',
      type: 'flight',
      description: 'Find and save flight options for your upcoming trips.',
      icon: 'fa-plane',
      count: 3
    }
  ];
  
  modules.forEach(module => {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.dataset.moduleType = module.id;
    
    card.innerHTML = `
      <div class="module-card-header">
        <h3 class="module-card-title">${module.title}</h3>
        <div class="module-card-actions">
          <button class="icon-button view-button"><i class="fas fa-eye"></i></button>
        </div>
      </div>
      <div class="module-card-content">
        <div class="module-icon ${module.id}-icon">
          <i class="fas ${module.icon}"></i>
        </div>
        <p class="module-description">${module.description}</p>
        <div class="module-count">${module.count} saved items</div>
      </div>
    `;
    
    moduleGrid.appendChild(card);
  });
}

// Weather module data
function loadWeatherData() {
  const weatherData = [
    {
      city: 'New York',
      temperature: 72,
      condition: 'Partly Cloudy',
      icon: 'fa-cloud-sun'
    },
    {
      city: 'London',
      temperature: 63,
      condition: 'Rainy',
      icon: 'fa-cloud-rain'
    },
    {
      city: 'Tokyo',
      temperature: 81,
      condition: 'Cloudy',
      icon: 'fa-cloud'
    }
  ];
  
  weatherData.forEach(weather => {
    addWeatherCard(weather.city, weather.temperature, weather.condition, weather.icon);
  });
}

// Add weather card
function addWeatherCard(city, temperature, condition, icon) {
  const weatherCards = document.getElementById('weather-cards');
  if (!weatherCards) return;
  
  // Generate random data if not provided
  temperature = temperature || Math.floor(Math.random() * 30) + 50;
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
  condition = condition || conditions[Math.floor(Math.random() * conditions.length)];
  const icons = ['fa-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-cloud-sun'];
  icon = icon || icons[Math.floor(Math.random() * icons.length)];
  
  const template = document.getElementById('weather-card-template');
  const card = template.content.cloneNode(true);
  
  card.querySelector('.card-title').textContent = city;
  card.querySelector('.weather-icon').innerHTML = `<i class="fas ${icon}"></i>`;
  card.querySelector('.temperature').textContent = `${temperature}°F`;
  card.querySelector('.condition').textContent = condition;
  
  weatherCards.appendChild(card);
}

// Country module data
function loadCountryData() {
  const countryData = [
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
  ];
  
  countryData.forEach(country => {
    addCountryCard(country.name, country);
  });
}

// Add country card
function addCountryCard(name, data) {
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
  
  const template = document.getElementById('country-card-template');
  const card = template.content.cloneNode(true);
  
  card.querySelector('.card-title').textContent = `${country.flag || ''} ${name}`;
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
}

// Currency module data
function loadCurrencyData() {
  const currencyData = [
    {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      rate: 0.91
    },
    {
      fromCurrency: 'EUR',
      toCurrency: 'JPY',
      rate: 161.85
    },
    {
      fromCurrency: 'GBP',
      toCurrency: 'USD',
      rate: 1.25
    }
  ];
  
  currencyData.forEach(currency => {
    addCurrencyCard(currency.fromCurrency, currency.toCurrency, currency.rate);
  });
}

// Add currency card
function addCurrencyCard(fromCurrency, toCurrency, rate) {
  const currencyCards = document.getElementById('currency-cards');
  if (!currencyCards) return;
  
  // Generate random rate if not provided
  rate = rate || parseFloat((Math.random() * (1.5 - 0.5) + 0.5).toFixed(4));
  
  const template = document.getElementById('currency-card-template');
  const card = template.content.cloneNode(true);
  const cardElement = card.querySelector('.currency-card');
  
  cardElement.dataset.rate = rate;
  card.querySelector('.card-title').textContent = `${fromCurrency} to ${toCurrency}`;
  
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
  
  card.querySelector('.rate-info').textContent = `${symbols[fromCurrency] || fromCurrency}1 = ${symbols[toCurrency] || toCurrency}${rate.toFixed(4)}`;
  card.querySelector('.from-currency-code').textContent = fromCurrency;
  card.querySelector('.to-currency-code').textContent = toCurrency;
  
  const amount = 100;
  const convertedAmount = (amount * rate).toFixed(2);
  card.querySelector('.converted-amount').textContent = convertedAmount;
  
  card.querySelector('.last-updated').textContent = `Last updated: ${new Date().toLocaleString()}`;
  
  currencyCards.appendChild(card);
}

// News module data
function loadNewsData() {
  const newsData = [
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
  ];
  
  newsData.forEach(news => {
    addNewsCard(null, news);
  });
}

// Add news card
function addNewsCard(searchTerm, newsItem) {
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
  
  const template = document.getElementById('news-card-template');
  const card = template.content.cloneNode(true);
  
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
  
  // Add to top of list for search results
  if (searchTerm) {
    newsCards.insertBefore(card, newsCards.firstChild);
  } else {
    newsCards.appendChild(card);
  }
}

// Flight module data
function loadFlightData() {
  const flightData = [
    {
      origin: 'New York (JFK)',
      destination: 'London (LHR)',
      departureDate: '2025-06-15',
      returnDate: '2025-06-22',
      price: '$850',
      airline: 'British Airways'
    },
    {
      origin: 'San Francisco (SFO)',
      destination: 'Tokyo (NRT)',
      departureDate: '2025-07-10',
      returnDate: '2025-07-25',
      price: '$1,200',
      airline: 'JAL'
    },
    {
      origin: 'Miami (MIA)',
      destination: 'Barcelona (BCN)',
      departureDate: '2025-08-05',
      returnDate: '2025-08-19',
      price: '$980',
      airline: 'Iberia'
    }
  ];
  
  flightData.forEach(flight => {
    addFlightCard(flight.origin, flight.destination, flight.departureDate, flight.returnDate, null, flight);
  });
}

// Add flight card
function addFlightCard(origin, destination, departureDate, returnDate, passengers, flightData) {
  const flightCards = document.getElementById('flight-cards');
  if (!flightCards) return;
  
  // Format dates
  const formattedDepartDate = departureDate ? new Date(departureDate).toLocaleDateString() : '';
  let dateText = `Depart: ${formattedDepartDate}`;
  
  if (returnDate) {
    const formattedReturnDate = new Date(returnDate).toLocaleDateString();
    dateText += ` · Return: ${formattedReturnDate}`;
  }
  
  // Use provided data or generate placeholder data
  let flight;
  if (flightData) {
    flight = flightData;
  } else {
    // Generate random flight data
    const airlines = ['American Airlines', 'Delta', 'United', 'Lufthansa', 'Emirates'];
    const randomPrice = Math.floor(Math.random() * 1000) + 500;
    
    flight = {
      origin: origin,
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      price: `$${randomPrice}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)]
    };
  }
  
  const template = document.getElementById('flight-card-template');
  const card = template.content.cloneNode(true);
  
  card.querySelector('.card-title').textContent = `Flight ${flight.origin} - ${flight.destination}`;
  card.querySelector('.origin').textContent = flight.origin;
  card.querySelector('.destination').textContent = flight.destination;
  card.querySelector('.date-info').textContent = dateText;
  card.querySelector('.price').textContent = flight.price;
  card.querySelector('.airline-name').textContent = flight.airline;
  
  flightCards.appendChild(card);
}
