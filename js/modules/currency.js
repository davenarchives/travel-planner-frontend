
import { currencyAPI } from '../api/currencyAPI.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const currencyModule = {
  // Initialize the currency module
  init(container) {
    // Create the currency module view
    const template = getTemplate('currency-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadCurrencyData();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  // Set up event listeners for the currency module
  setupEventListeners() {
    // Add currency pair button
    const addCurrencyPairBtn = document.getElementById('add-currency-pair-btn');
    if (addCurrencyPairBtn) {
      addCurrencyPairBtn.addEventListener('click', () => {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        this.addCurrencyPair(fromCurrency, toCurrency);
      });
    }
    
    // Update converted amount on input change (event delegation)
    document.addEventListener('input', (event) => {
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
  },
  
  // Load initial currency data
  loadCurrencyData() {
    // Initial currency pairs to load
    const currencyPairs = [
      { from: 'USD', to: 'EUR' },
      { from: 'EUR', to: 'JPY' },
      { from: 'GBP', to: 'USD' }
    ];
    
    // Get data for each currency pair
    currencyPairs.forEach(pair => {
      this.addCurrencyPair(pair.from, pair.to);
    });
  },
  
  // Add a currency pair
  addCurrencyPair(fromCurrency, toCurrency) {
    const currencyCards = document.getElementById('currency-cards');
    if (!currencyCards) return;
    
    // Get exchange rate from API
    currencyAPI.getExchangeRate(fromCurrency, toCurrency)
      .then(rate => {
        const card = document.importNode(document.getElementById('currency-card-template').content, true);
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
        
        // Generate a unique ID for the currency pair
        const currencyId = `currency-${fromCurrency}-${toCurrency}-${Date.now()}`;
        cardElement.dataset.currencyId = currencyId;
        
        // Check if already bookmarked
        const bookmarkedCurrencies = JSON.parse(localStorage.getItem('bookmarkedCurrencies') || '[]');
        const isBookmarked = bookmarkedCurrencies.some(c => c.fromCurrency === fromCurrency && c.toCurrency === toCurrency);
        
        if (isBookmarked) {
          const bookmarkButton = card.querySelector('.bookmark-button');
          bookmarkButton.classList.add('active');
          bookmarkButton.querySelector('i').classList.add('active');
        }
        
        currencyCards.appendChild(card);
      })
      .catch(error => {
        console.error('Error loading exchange rate:', error);
      });
  },
  
  // Handle delete button click
  handleDelete(card) {
    card.remove();
    
    // Remove from bookmarks if bookmarked
    const currencyId = card.dataset.currencyId;
    if (currencyId) {
      const bookmarkedCurrencies = JSON.parse(localStorage.getItem('bookmarkedCurrencies') || '[]');
      const updatedBookmarks = bookmarkedCurrencies.filter(c => c.currencyId !== currencyId);
      localStorage.setItem('bookmarkedCurrencies', JSON.stringify(updatedBookmarks));
    }
  },
  
  // Handle bookmark button click
  handleBookmark(card) {
    const currencyId = card.dataset.currencyId;
    const fromCurrency = card.querySelector('.from-currency-code').textContent;
    const toCurrency = card.querySelector('.to-currency-code').textContent;
    const rate = parseFloat(card.dataset.rate);
    const lastUpdated = card.querySelector('.last-updated').textContent;
    
    if (!currencyId || !rate) return;
    
    const bookmarkedCurrencies = JSON.parse(localStorage.getItem('bookmarkedCurrencies') || '[]');
    const bookmarkButton = card.querySelector('.bookmark-button');
    
    // Check if already bookmarked
    const bookmarkIndex = bookmarkedCurrencies.findIndex(c => c.currencyId === currencyId);
    
    if (bookmarkIndex >= 0) {
      // Remove from bookmarks
      bookmarkedCurrencies.splice(bookmarkIndex, 1);
      bookmarkButton.classList.remove('active');
      bookmarkButton.querySelector('i').classList.remove('active');
    } else {
      // Add to bookmarks
      bookmarkedCurrencies.push({
        currencyId,
        fromCurrency,
        toCurrency,
        rate,
        lastUpdated
      });
      bookmarkButton.classList.add('active');
      bookmarkButton.querySelector('i').classList.add('active');
    }
    
    // Save updated bookmarks to localStorage
    localStorage.setItem('bookmarkedCurrencies', JSON.stringify(bookmarkedCurrencies));
  }
};
