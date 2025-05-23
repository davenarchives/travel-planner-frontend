
import { countryAPI } from '../api/countryAPI.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const countryModule = {
  init(container) {
    const template = getTemplate('country-template');
    container.appendChild(template);
    this.loadCountryData();
    this.setupEventListeners();
  },

  setupEventListeners() {
    const addCountryBtn = document.getElementById('add-country-btn');
    if (addCountryBtn) {
      addCountryBtn.addEventListener('click', () => {
        const input = document.getElementById('country-search-input');
        if (input && input.value.trim() !== '') {
          this.addCountry(input.value.trim());
          input.value = '';
        }
      });
    }

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
    // Load initial country data from the API
    countryAPI.getAllCountries()
      .then(countries => {
        if (countries && countries.length > 0) {
          // We'll just load the first three countries or as many as available
          const initialCountries = countries.slice(0, 3);
          initialCountries.forEach(countryData => {
            this.addCountryFromData(countryData);
          });
        } else {
          console.warn('No countries returned from API');
        }
      })
      .catch(error => {
        console.error('Error loading initial country data:', error);
        // Fallback to default countries if API fails
        const countries = ['Japan', 'Italy', 'New Zealand'];
        countries.forEach(country => {
          this.addCountry(country);
        });
      });
  },

  addCountry(countryName) {
    const countryCards = document.getElementById('country-cards');
    if (!countryCards) return;

    countryAPI.getCountryInfo(countryName)
      .then(country => {
        if (country) {
          this.addCountryFromData(country);
        } else {
          console.error(`Country ${countryName} not found`);
        }
      })
      .catch(error => {
        console.error('Error loading country data:', error);
      });
  },

  addCountryFromData(country) {
    const countryCards = document.getElementById('country-cards');
    if (!countryCards) return;

    const card = document.importNode(document.getElementById('country-card-template').content, true);

    card.querySelector('.card-title').textContent = `${country.flag || ''} ${country.name}`;
    card.querySelector('.capital').textContent = country.capital;
    card.querySelector('.population').textContent = country.population;
    card.querySelector('.region').textContent = country.region;

    const tagsContainer = card.querySelector('.tags-container');
    tagsContainer.innerHTML = '';
    
    // Check if tags exist, if not use an empty array
    const tags = country.tags || [];
    tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });

    const countryId = `country-${country.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
    const countryCard = card.querySelector('.card');
    countryCard.dataset.countryId = countryId;

    const bookmarkedCountries = JSON.parse(localStorage.getItem('bookmarkedCountries') || '[]');
    const isBookmarked = bookmarkedCountries.some(c => c.name === country.name);

    if (isBookmarked) {
      const bookmarkButton = card.querySelector('.bookmark-button');
      bookmarkButton.classList.add('active');
      bookmarkButton.querySelector('i').classList.add('active');
    }

    countryCards.appendChild(card);
  },

  handleDelete(card) {
    card.remove();
    const countryId = card.dataset.countryId;
    if (countryId) {
      const bookmarkedCountries = JSON.parse(localStorage.getItem('bookmarkedCountries') || '[]');
      const updatedBookmarks = bookmarkedCountries.filter(c => c.countryId !== countryId);
      localStorage.setItem('bookmarkedCountries', JSON.stringify(updatedBookmarks));
    }
  },

  handleBookmark(card) {
    const countryId = card.dataset.countryId;
    const nameWithFlag = card.querySelector('.card-title').textContent;
    const nameParts = nameWithFlag.split(' ');
    const flag = nameParts.length > 1 && nameParts[0].length <= 4 ? nameParts[0] : '';
    const name = flag ? nameWithFlag.substring(flag.length).trim() : nameWithFlag;
    const capital = card.querySelector('.capital').textContent;
    const population = card.querySelector('.population').textContent;
    const region = card.querySelector('.region').textContent;
    const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);

    if (!countryId) return;

    const bookmarkedCountries = JSON.parse(localStorage.getItem('bookmarkedCountries') || '[]');
    const bookmarkButton = card.querySelector('.bookmark-button');

    const bookmarkIndex = bookmarkedCountries.findIndex(c => c.countryId === countryId);

    if (bookmarkIndex >= 0) {
      bookmarkedCountries.splice(bookmarkIndex, 1);
      bookmarkButton.classList.remove('active');
      bookmarkButton.querySelector('i').classList.remove('active');
    } else {
      bookmarkedCountries.push({
        countryId,
        name,
        flag,
        capital,
        population,
        region,
        tags
      });
      bookmarkButton.classList.add('active');
      bookmarkButton.querySelector('i').classList.add('active');
    }

    localStorage.setItem('bookmarkedCountries', JSON.stringify(bookmarkedCountries));
  }
};
