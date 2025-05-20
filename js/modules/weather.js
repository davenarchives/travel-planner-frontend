
import { weatherAPI } from '../api/weatherAPI.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const weatherModule = {
  // Initialize the weather module
  init(container) {
    // Create the weather module view
    const template = getTemplate('weather-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadWeatherData();
    
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
  
  // Load initial weather data
  loadWeatherData() {
    // Initial cities to load
    const cities = ['New York', 'London', 'Tokyo'];
    
    // Get weather data for each city
    cities.forEach(city => {
      this.addCity(city);
    });
  },
  
  // Add a city to the weather tracking
  addCity(city) {
    const weatherCards = document.getElementById('weather-cards');
    if (!weatherCards) return;
    
    // Get weather data from API
    weatherAPI.getWeather(city)
      .then(weather => {
        const card = document.importNode(document.getElementById('weather-card-template').content, true);
        
        card.querySelector('.card-title').textContent = weather.city;
        card.querySelector('.weather-icon').innerHTML = `<i class="fas ${weather.icon}"></i>`;
        card.querySelector('.temperature').textContent = `${weather.temperature}°F`;
        card.querySelector('.condition').textContent = weather.condition;
        
        weatherCards.appendChild(card);
      })
      .catch(error => {
        console.error('Error loading weather data:', error);
      });
  },
  
  // Handle delete button click
  handleDelete(card) {
    card.remove();
  },
  
  // Handle edit button click
  handleEdit(card) {
    const city = card.querySelector('.card-title').textContent;
    
    // Get fresh weather data
    weatherAPI.getWeather(city)
      .then(weather => {
        card.querySelector('.weather-icon').innerHTML = `<i class="fas ${weather.icon}"></i>`;
        card.querySelector('.temperature').textContent = `${weather.temperature}°F`;
        card.querySelector('.condition').textContent = weather.condition;
      })
      .catch(error => {
        console.error('Error updating weather data:', error);
      });
  }
};
