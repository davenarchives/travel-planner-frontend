
import { flightAPI } from '../api/flightAPI.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const bookmarksModule = {
  // Initialize the bookmarks module
  init(container) {
    // Create bookmarks view
    const bookmarksContainer = document.createElement('div');
    bookmarksContainer.className = 'bookmarks-container';
    
    // Add header
    const header = document.createElement('h2');
    header.className = 'section-title';
    header.textContent = 'Bookmarked Flights';
    bookmarksContainer.appendChild(header);
    
    // Add container for cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'card-grid';
    cardsContainer.id = 'bookmarked-flights-cards';
    bookmarksContainer.appendChild(cardsContainer);
    
    // Add the container to the page
    container.appendChild(bookmarksContainer);
    
    // Load bookmarked flights
    this.loadBookmarkedFlights();
    
    // Set up event delegation
    this.setupEventListeners(container);
  },
  
  // Load bookmarked flights
  loadBookmarkedFlights() {
    const cardsContainer = document.getElementById('bookmarked-flights-cards');
    if (!cardsContainer) return;
    
    // Clear container
    cardsContainer.innerHTML = '';
    
    flightAPI.getBookmarkedFlights()
      .then(bookmarkedFlights => {
        if (bookmarkedFlights.length === 0) {
          // Show empty state
          const emptyState = document.createElement('div');
          emptyState.className = 'empty-bookmarks';
          emptyState.innerHTML = `
            <i class="fas fa-bookmark"></i>
            <p>No bookmarked flights yet</p>
            <span>Your bookmarked flights will appear here</span>
          `;
          cardsContainer.appendChild(emptyState);
        } else {
          // Add bookmarked flights
          bookmarkedFlights.forEach(flight => {
            this.addFlightCard(flight, cardsContainer, true);
          });
        }
      })
      .catch(error => {
        console.error('Error loading bookmarked flights:', error);
      });
  },
  
  // Add a flight card
  addFlightCard(flight, container, isBookmarked) {
    const template = document.getElementById('flight-card-template');
    const card = document.importNode(template.content, true);
    const cardElement = card.querySelector('.flight-card');
    
    // Store flight ID on the card element
    cardElement.dataset.flightId = flight.id;
    
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
    
    // Update the bookmark button
    if (isBookmarked) {
      const bookmarkBtn = card.querySelector('.bookmark-button');
      if (bookmarkBtn) {
        bookmarkBtn.classList.add('active');
      }
    }
    
    // Add the card to the container
    container.appendChild(card);
  },
  
  // Set up event listeners
  setupEventListeners(container) {
    // Global event delegation for bookmarking and deleting flights
    container.addEventListener('click', e => {
      // Handle unbookmark
      if (e.target.closest('.bookmark-button')) {
        const button = e.target.closest('.bookmark-button');
        const card = button.closest('.flight-card');
        const flightId = card.dataset.flightId;
        
        // Remove bookmark
        flightAPI.removeBookmark(flightId).then(() => {
          // Refresh the bookmarks list
          this.loadBookmarkedFlights();
        });
      }
      
      // Handle delete
      if (e.target.closest('.delete-button')) {
        const card = e.target.closest('.flight-card');
        const flightId = card.dataset.flightId;
        
        flightAPI.deleteFlight(flightId).then(() => {
          // Refresh the bookmarks list
          this.loadBookmarkedFlights();
        });
      }
    });
  },
  
  // Handle delete button click
  handleDelete(card) {
    const flightId = card.dataset.flightId;
    
    flightAPI.deleteFlight(flightId).then(() => {
      card.remove();
      
      // Refresh the bookmark list
      this.loadBookmarkedFlights();
    });
  }
};
