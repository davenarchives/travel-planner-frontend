
import { getTemplate } from '../utils/templatesUtil.js';

export const bookmarkModule = {
  // Initialize the bookmark module
  init(container) {
    // Create the bookmark module view
    const template = getTemplate('bookmark-template');
    container.appendChild(template);
    
    // Load bookmarked items
    this.loadBookmarkedItems();
  },
  
  // Load bookmarked items
  loadBookmarkedItems() {
    const bookmarkCards = document.getElementById('bookmark-cards');
    if (!bookmarkCards) return;
    
    // Clear existing cards
    bookmarkCards.innerHTML = '';
    
    // Get bookmarked items from localStorage
    const bookmarkedItems = this.getAllBookmarkedItems();
    
    if (Object.values(bookmarkedItems).flat().length === 0) {
      // Display a message if no bookmarks
      const noBookmarks = document.createElement('div');
      noBookmarks.className = 'no-data';
      noBookmarks.textContent = 'No bookmarked items yet. Use the bookmark button on items to save them here.';
      bookmarkCards.appendChild(noBookmarks);
      return;
    }
    
    // Add each bookmarked item by type
    this.renderBookmarkSection(bookmarkCards, 'flight', bookmarkedItems.flights);
    this.renderBookmarkSection(bookmarkCards, 'weather', bookmarkedItems.weather);
    this.renderBookmarkSection(bookmarkCards, 'country', bookmarkedItems.countries);
    this.renderBookmarkSection(bookmarkCards, 'currency', bookmarkedItems.currencies);
    this.renderBookmarkSection(bookmarkCards, 'news', bookmarkedItems.news);
  },
  
  // Render a section of bookmarks by type
  renderBookmarkSection(container, type, items) {
    if (!items || items.length === 0) return;
    
    // Create section header
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'bookmark-section-header';
    
    const titles = {
      'flight': 'Saved Flights',
      'weather': 'Saved Weather Locations',
      'country': 'Saved Countries',
      'currency': 'Saved Currency Pairs',
      'news': 'Saved News Articles'
    };
    
    sectionHeader.innerHTML = `<h2>${titles[type]}</h2>`;
    container.appendChild(sectionHeader);
    
    // Create card container
    const cardGrid = document.createElement('div');
    cardGrid.className = 'card-grid';
    container.appendChild(cardGrid);
    
    // Add items
    items.forEach(item => {
      let card;
      switch(type) {
        case 'flight':
          card = this.createFlightBookmarkCard(item);
          break;
        case 'weather':
          card = this.createWeatherBookmarkCard(item);
          break;
        case 'country':
          card = this.createCountryBookmarkCard(item);
          break;
        case 'currency':
          card = this.createCurrencyBookmarkCard(item);
          break;
        case 'news':
          card = this.createNewsBookmarkCard(item);
          break;
      }
      
      if (card) {
        cardGrid.appendChild(card);
      }
    });
  },
  
  // Create flight bookmark card
  createFlightBookmarkCard(flight) {
    const card = document.importNode(document.getElementById('flight-card-template').content, true);
    
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
    
    // Set bookmark button to active
    const bookmarkButton = card.querySelector('.bookmark-button');
    bookmarkButton.classList.add('active');
    bookmarkButton.querySelector('i').classList.add('active');
    
    // Set data attributes
    const flightCard = card.querySelector('.card');
    flightCard.dataset.flightId = flight.flightId;
    flightCard.dataset.itemType = 'flight';
    
    return card;
  },
  
  // Create weather bookmark card
  createWeatherBookmarkCard(weather) {
    const card = document.importNode(document.getElementById('weather-card-template').content, true);
    
    card.querySelector('.card-title').textContent = weather.city;
    card.querySelector('.weather-icon').innerHTML = `<i class="fas ${weather.icon}"></i>`;
    card.querySelector('.temperature').textContent = `${weather.temperature}°F`;
    card.querySelector('.condition').textContent = weather.condition;
    
    // Set bookmark button to active
    const bookmarkButton = card.querySelector('.bookmark-button');
    bookmarkButton.classList.add('active');
    bookmarkButton.querySelector('i').classList.add('active');
    
    // Set data attributes
    const weatherCard = card.querySelector('.card');
    weatherCard.dataset.weatherId = weather.weatherId;
    weatherCard.dataset.itemType = 'weather';
    
    return card;
  },
  
  // Create country bookmark card
  createCountryBookmarkCard(country) {
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
    
    // Set bookmark button to active
    const bookmarkButton = card.querySelector('.bookmark-button');
    bookmarkButton.classList.add('active');
    bookmarkButton.querySelector('i').classList.add('active');
    
    // Set data attributes
    const countryCard = card.querySelector('.card');
    countryCard.dataset.countryId = country.countryId;
    countryCard.dataset.itemType = 'country';
    
    return card;
  },
  
  // Create currency bookmark card
  createCurrencyBookmarkCard(currency) {
    const card = document.importNode(document.getElementById('currency-card-template').content, true);
    const currencyCard = card.querySelector('.card');
    
    currencyCard.dataset.rate = currency.rate;
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
    
    // Set bookmark button to active
    const bookmarkButton = card.querySelector('.bookmark-button');
    bookmarkButton.classList.add('active');
    bookmarkButton.querySelector('i').classList.add('active');
    
    // Set data attributes
    currencyCard.dataset.currencyId = currency.currencyId;
    currencyCard.dataset.itemType = 'currency';
    
    return card;
  },
  
  // Create news bookmark card
  createNewsBookmarkCard(news) {
    const card = document.importNode(document.getElementById('news-card-template').content, true);
    
    card.querySelector('.card-title').textContent = news.title;
    card.querySelector('.news-source').textContent = news.source;
    card.querySelector('.news-category').textContent = news.category;
    card.querySelector('.news-snippet').textContent = news.snippet;
    card.querySelector('.published-date').textContent = `Published: ${new Date(news.publishedAt).toLocaleDateString()}`;
    
    // Set save button to saved
    const saveButton = card.querySelector('.save-article-button');
    saveButton.textContent = 'Saved';
    saveButton.disabled = true;
    saveButton.style.opacity = '0.5';
    
    // Set bookmark button to active
    const bookmarkButton = card.querySelector('.bookmark-button');
    bookmarkButton.classList.add('active');
    bookmarkButton.querySelector('i').classList.add('active');
    
    // Set data attributes
    const newsCard = card.querySelector('.card');
    newsCard.dataset.newsId = news.newsId;
    newsCard.dataset.itemType = 'news';
    
    return card;
  },
  
  // Get all bookmarked items
  getAllBookmarkedItems() {
    return {
      flights: JSON.parse(localStorage.getItem('bookmarkedFlights') || '[]'),
      weather: JSON.parse(localStorage.getItem('bookmarkedWeather') || '[]'),
      countries: JSON.parse(localStorage.getItem('bookmarkedCountries') || '[]'),
      currencies: JSON.parse(localStorage.getItem('bookmarkedCurrencies') || '[]'),
      news: JSON.parse(localStorage.getItem('bookmarkedNews') || '[]')
    };
  },
  
  // Handle delete button click - removes from bookmarks
  handleDelete(card) {
    const itemType = card.dataset.itemType || this.getItemType(card);
    const itemId = 
      card.dataset.flightId || 
      card.dataset.weatherId || 
      card.dataset.countryId || 
      card.dataset.currencyId || 
      card.dataset.newsId;
    
    if (!itemId) return;
    
    // Remove from DOM
    card.remove();
    
    // Remove from localStorage
    this.removeItemFromLocalStorage(itemType, itemId);
    
    // Check if any cards left in the section
    const section = card.closest('.card-grid');
    if (section && section.children.length === 0) {
      const header = section.previousElementSibling;
      if (header && header.classList.contains('bookmark-section-header')) {
        header.remove();
        section.remove();
      }
    }
    
    // If no more bookmarks, show the empty message
    const bookmarkCards = document.getElementById('bookmark-cards');
    if (bookmarkCards && bookmarkCards.children.length === 0) {
      const noBookmarks = document.createElement('div');
      noBookmarks.className = 'no-data';
      noBookmarks.textContent = 'No bookmarked items yet. Use the bookmark button on items to save them here.';
      bookmarkCards.appendChild(noBookmarks);
    }
  },
  
  // Remove item from localStorage
  removeItemFromLocalStorage(itemType, itemId) {
    const storageKeys = {
      'flight': 'bookmarkedFlights',
      'weather': 'bookmarkedWeather',
      'country': 'bookmarkedCountries',
      'currency': 'bookmarkedCurrencies',
      'news': 'bookmarkedNews'
    };
    
    const storageKey = storageKeys[itemType];
    if (!storageKey) return;
    
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedItems = items.filter(item => {
      const id = item.flightId || item.weatherId || item.countryId || item.currencyId || item.newsId;
      return id !== itemId;
    });
    
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  },
  
  // Get item type from card
  getItemType(card) {
    if (card.classList.contains('flight-card')) return 'flight';
    if (card.classList.contains('weather-card')) return 'weather';
    if (card.classList.contains('country-card')) return 'country';
    if (card.classList.contains('currency-card')) return 'currency';
    if (card.classList.contains('news-card')) return 'news';
    return '';
  },
  
  // Handle bookmark button click - removes from bookmarks
  handleBookmark(card) {
    this.handleDelete(card);
  }
};
