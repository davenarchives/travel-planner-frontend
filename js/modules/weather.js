
import { getTemplate } from '../templates.js';

export const weatherModule = {
  // Mock data for weather
  weatherData: [
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
  ],
  
  init(container) {
    // Create the weather module view
    const template = getTemplate('weather-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadWeatherData();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    // Add city button
    const addCityBtn = document.getElementById('add-city-btn');
    if (addCityBtn) {
      addCityBtn.addEventListener('click', () => {
        const input = document.getElementById('weather-city-input');
        if (input && input.value.trim() !== '') {
          this.addWeatherCard(input.value);
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
  
  loadWeatherData() {
    this.weatherData.forEach(weather => {
      this.addWeatherCard(weather.city, weather.temperature, weather.condition, weather.icon);
    });
  },
  
  addWeatherCard(city, temperature, condition, icon) {
    const weatherCards = document.getElementById('weather-cards');
    if (!weatherCards) return;
    
    // Generate random data if not provided
    temperature = temperature || Math.floor(Math.random() * 30) + 50;
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
    condition = condition || conditions[Math.floor(Math.random() * conditions.length)];
    const icons = ['fa-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-cloud-sun'];
    icon = icon || icons[Math.floor(Math.random() * icons.length)];
    
    const template = getTemplate('weather-card-template');
    
    template.querySelector('.card-title').textContent = city;
    template.querySelector('.weather-icon').innerHTML = `<i class="fas ${icon}"></i>`;
    template.querySelector('.temperature').textContent = `${temperature}°F`;
    template.querySelector('.condition').textContent = condition;
    
    // Add the card to the grid
    weatherCards.appendChild(template);
  },
  
  handleDelete(card) {
    // In a real app, this would call an API to delete the data
    card.remove();
    console.log('Weather card deleted');
  },
  
  handleEdit(card) {
    // In a real app, this would open an edit form
    const city = card.querySelector('.card-title').textContent;
    console.log(`Editing weather card for ${city}`);
    
    // Simple demonstration - update temperature
    const tempElement = card.querySelector('.temperature');
    const newTemp = Math.floor(Math.random() * 30) + 50;
    tempElement.textContent = `${newTemp}°F`;
  }
};
