
import { getTemplate } from '../utils/templatesUtil.js';

export const bookmarkModule = {
  // Initialize the bookmark module
  init(container) {
    // Create the bookmark module view
    const template = getTemplate('bookmark-template');
    container.appendChild(template);
    
    // Load bookmarked flights
    this.loadBookmarkedFlights();
  },
  
  // Load bookmarked flights
  loadBookmarkedFlights() {
    const bookmarkCards = document.getElementById('bookmark-cards');
    if (!bookmarkCards) return;
    
    // Clear existing cards
    bookmarkCards.innerHTML = '';
    
    // Get bookmarked flights from localStorage
    const bookmarkedFlights = JSON.parse(localStorage.getItem('bookmarkedFlights') || '[]');
    
    if (bookmarkedFlights.length === 0) {
      // Display a message if no bookmarks
      const noBookmarks = document.createElement('div');
      noBookmarks.className = 'no-data';
      noBookmarks.textContent = 'No bookmarked flights yet. Use the bookmark button on flights to save them here.';
      bookmarkCards.appendChild(noBookmarks);
      return;
    }
    
    // Add each bookmarked flight
    bookmarkedFlights.forEach(flight => {
      this.addBookmarkedFlightCard(flight);
    });
  },
  
  // Add a bookmarked flight card
  addBookmarkedFlightCard(flight) {
    const bookmarkCards = document.getElementById('bookmark-cards');
    if (!bookmarkCards) return;
    
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
    
    bookmarkCards.appendChild(card);
  },
  
  // Handle delete button click - removes from bookmarks
  handleDelete(card) {
    const flightId = card.dataset.flightId;
    
    if (!flightId) return;
    
    // Remove from DOM
    card.remove();
    
    // Remove from localStorage
    const bookmarkedFlights = JSON.parse(localStorage.getItem('bookmarkedFlights') || '[]');
    const updatedBookmarks = bookmarkedFlights.filter(f => f.flightId !== flightId);
    localStorage.setItem('bookmarkedFlights', JSON.stringify(updatedBookmarks));
    
    // If no more bookmarks, show the empty message
    const bookmarkCards = document.getElementById('bookmark-cards');
    if (bookmarkCards && bookmarkCards.children.length === 0) {
      const noBookmarks = document.createElement('div');
      noBookmarks.className = 'no-data';
      noBookmarks.textContent = 'No bookmarked flights yet. Use the bookmark button on flights to save them here.';
      bookmarkCards.appendChild(noBookmarks);
    }
  },
  
  // Handle bookmark button click - removes from bookmarks
  handleBookmark(card) {
    this.handleDelete(card);
  }
};
