
import { getTemplate } from '../../js/templates.js';

export const currencyModule = {
  // Mock data for currency pairs
  currencyData: [
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
  ],
  
  init(container) {
    // Create the currency module view
    const template = getTemplate('currency-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadCurrencyData();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    // Add currency pair button
    const addCurrencyPairBtn = document.getElementById('add-currency-pair-btn');
    if (addCurrencyPairBtn) {
      addCurrencyPairBtn.addEventListener('click', () => {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        this.addCurrencyCard(fromCurrency, toCurrency);
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
  
  loadCurrencyData() {
    this.currencyData.forEach(currency => {
      this.addCurrencyCard(currency.fromCurrency, currency.toCurrency, currency.rate);
    });
  },
  
  addCurrencyCard(fromCurrency, toCurrency, rate) {
    const currencyCards = document.getElementById('currency-cards');
    if (!currencyCards) return;
    
    // Generate random rate if not provided
    rate = rate || parseFloat((Math.random() * (1.5 - 0.5) + 0.5).toFixed(4));
    
    const template = getTemplate('currency-card-template');
    const card = template.querySelector('.currency-card');
    
    card.dataset.rate = rate;
    template.querySelector('.card-title').textContent = `${fromCurrency} to ${toCurrency}`;
    
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
    
    template.querySelector('.rate-info').textContent = `${symbols[fromCurrency] || fromCurrency}1 = ${symbols[toCurrency] || toCurrency}${rate.toFixed(4)}`;
    template.querySelector('.from-currency-code').textContent = fromCurrency;
    template.querySelector('.to-currency-code').textContent = toCurrency;
    
    const amount = 100;
    const convertedAmount = (amount * rate).toFixed(2);
    template.querySelector('.converted-amount').textContent = convertedAmount;
    
    template.querySelector('.last-updated').textContent = `Last updated: ${new Date().toLocaleString()}`;
    
    // Add the card to the grid
    currencyCards.appendChild(template);
  },
  
  handleDelete(card) {
    // In a real app, this would call an API to delete the data
    card.remove();
    console.log('Currency card deleted');
  },
  
  handleEdit(card) {
    // In a real app, this would open an edit form
    const currency = card.querySelector('.card-title').textContent;
    console.log(`Editing currency card for ${currency}`);
    
    // Simple demonstration - update exchange rate
    const rate = (Math.random() * (1.5 - 0.5) + 0.5).toFixed(4);
    card.dataset.rate = rate;
    
    const fromCurrency = card.querySelector('.from-currency-code').textContent;
    const toCurrency = card.querySelector('.to-currency-code').textContent;
    
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
    
    card.querySelector('.rate-info').textContent = `${symbols[fromCurrency] || fromCurrency}1 = ${symbols[toCurrency] || toCurrency}${rate}`;
    card.querySelector('.last-updated').textContent = `Last updated: ${new Date().toLocaleString()}`;
    
    // Update converted amount based on current input value
    const amountInput = card.querySelector('.amount-input');
    const amount = parseFloat(amountInput.value) || 0;
    const convertedAmount = (amount * parseFloat(rate)).toFixed(2);
    card.querySelector('.converted-amount').textContent = convertedAmount;
  }
};
