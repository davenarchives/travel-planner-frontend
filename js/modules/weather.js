import { weatherAPI } from '../api/weatherAPI.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const weatherModule = {
  // Initialize the weather module
  init(container) {
    // Create the weather module view
    const template = getTemplate('weather-template');
    container.appendChild(template);
    
    // Load saved data first
    this.loadSavedWeather();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  // Set up event listeners for the weather module
  setupEventListeners() {
    // Add city button
    const addCityBtn = document.getElementById('add-city-btn');
    if (addCityBtn) {
      addCityBtn.addEventListener('click', () => {
        const input = document.getElementById('weather-city-input');
        if (input && input.value.trim() !== '') {
          this.addCity(input.value);
          input.value = '';
        }
      });
    }
    
    // Enter key in input field
    const cityInput = document.getElementById('weather-city-input');
    if (cityInput) {
      cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          document.getElementById('add-city-btn')?.click();
        }
      });
    }
  },
  
  // Load saved weather data from localStorage
  loadSavedWeather() {
    const savedWeather = JSON.parse(localStorage.getItem('savedWeather') || '[]');
    
    if (savedWeather.length === 0) {
      // Load initial cities if no saved data
      const cities = ['New York', 'London', 'Tokyo'];
      cities.forEach(city => {
        this.addCity(city);
      });
    } else {
      // Load saved weather data
      savedWeather.forEach(weather => {
        this.addWeatherFromData(weather);
      });
    }
  },
  
  // Add a city to the weather tracking
  addCity(city) {
    const weatherCards = document.getElementById('weather-cards');
    if (!weatherCards) return;
    
    // Get weather data from API
    weatherAPI.getWeather(city)
      .then(weather => {
        this.addWeatherFromData(weather);
        this.saveWeatherToStorage(weather);
      })
      .catch(error => {
        console.error('Error loading weather data:', error);
      });
  },
  
  // Add weather card from data
  addWeatherFromData(weather) {
    const weatherCards = document.getElementById('weather-cards');
    if (!weatherCards) return;
    
    const card = document.importNode(document.getElementById('weather-card-template').content, true);
    
    card.querySelector('.card-title').textContent = weather.city;
    card.querySelector('.weather-icon').innerHTML = `<i class="fas ${weather.icon}"></i>`;
    card.querySelector('.temperature').textContent = `${weather.temperature}°F`;
    card.querySelector('.condition').textContent = weather.condition;
    
    // Generate a unique ID for the weather
    const weatherId = `weather-${weather.city.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
    const weatherCard = card.querySelector('.card');
    weatherCard.dataset.weatherId = weatherId;
    
    // Check if already bookmarked
    const bookmarkedWeather = JSON.parse(localStorage.getItem('bookmarkedWeather') || '[]');
    const isBookmarked = bookmarkedWeather.some(w => w.city === weather.city);
    
    if (isBookmarked) {
      const bookmarkButton = card.querySelector('.bookmark-button');
      bookmarkButton.classList.add('active');
      bookmarkButton.querySelector('i').classList.add('active');
    }
    
    weatherCards.appendChild(card);
  },
  
  // Save weather to localStorage
  saveWeatherToStorage(weather) {
    const savedWeather = JSON.parse(localStorage.getItem('savedWeather') || '[]');
    
    // Check if weather already exists
    const existingIndex = savedWeather.findIndex(w => w.city === weather.city);
    if (existingIndex === -1) {
      savedWeather.push(weather);
      localStorage.setItem('savedWeather', JSON.stringify(savedWeather));
    }
  },
  
  // Handle delete button click
  handleDelete(card) {
    const city = card.querySelector('.card-title').textContent;
    
    // Remove from DOM
    card.remove();
    
    // Remove from saved weather
    const savedWeather = JSON.parse(localStorage.getItem('savedWeather') || '[]');
    const updatedWeather = savedWeather.filter(w => w.city !== city);
    localStorage.setItem('savedWeather', JSON.stringify(updatedWeather));
    
    // Remove from bookmarks if bookmarked
    const weatherId = card.dataset.weatherId;
    if (weatherId) {
      const bookmarkedWeather = JSON.parse(localStorage.getItem('bookmarkedWeather') || '[]');
      const updatedBookmarks = bookmarkedWeather.filter(w => w.weatherId !== weatherId);
      localStorage.setItem('bookmarkedWeather', JSON.stringify(updatedBookmarks));
    }
  },
  
  // Handle bookmark button click
  handleBookmark(card) {
    const weatherId = card.dataset.weatherId;
    const city = card.querySelector('.card-title').textContent;
    const temperature = card.querySelector('.temperature').textContent.replace('°F', '');
    const condition = card.querySelector('.condition').textContent;
    const icon = card.querySelector('.weather-icon i').className.replace('fas ', '');
    
    if (!weatherId) return;
    
    const bookmarkedWeather = JSON.parse(localStorage.getItem('bookmarkedWeather') || '[]');
    const bookmarkButton = card.querySelector('.bookmark-button');
    
    // Check if already bookmarked
    const bookmarkIndex = bookmarkedWeather.findIndex(w => w.weatherId === weatherId);
    
    if (bookmarkIndex >= 0) {
      // Remove from bookmarks
      bookmarkedWeather.splice(bookmarkIndex, 1);
      bookmarkButton.classList.remove('active');
      bookmarkButton.querySelector('i').classList.remove('active');
    } else {
      // Add to bookmarks
      bookmarkedWeather.push({
        weatherId,
        city,
        temperature,
        condition,
        icon
      });
      bookmarkButton.classList.add('active');
      bookmarkButton.querySelector('i').classList.add('active');
    }
    
    // Save updated bookmarks to localStorage
    localStorage.setItem('bookmarkedWeather', JSON.stringify(bookmarkedWeather));
  }
};