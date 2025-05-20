
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
        
        currencyCards.appendChild(card);
      })
      .catch(error => {
        console.error('Error loading exchange rate:', error);
      });
  },
  
  // Handle delete button click
  handleDelete(card) {
    card.remove();
  },
  
  // Handle edit button click
  handleEdit(card) {
    // Update the exchange rate
    const fromCurrency = card.querySelector('.from-currency-code').textContent;
    const toCurrency = card.querySelector('.to-currency-code').textContent;
    
    // Get fresh exchange rate
    currencyAPI.getExchangeRate(fromCurrency, toCurrency)
      .then(rate => {
        card.dataset.rate = rate;
        
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
        
        // Update converted amount based on current input value
        const amountInput = card.querySelector('.amount-input');
        const amount = parseFloat(amountInput.value) || 0;
        const convertedAmount = (amount * rate).toFixed(2);
        card.querySelector('.converted-amount').textContent = convertedAmount;
        
        card.querySelector('.last-updated').textContent = `Last updated: ${new Date().toLocaleString()}`;
      })
      .catch(error => {
        console.error('Error updating exchange rate:', error);
      });
  }
};
