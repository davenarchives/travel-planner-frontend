
import { flightAPI } from '../api/flightAPI.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const flightModule = {
  // Initialize the flight module
  init(container) {
    // Create the flight module view
    const template = getTemplate('flight-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadFlightData();
    this.loadBookmarkedFlights();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
  // Set up event listeners for the flight module
  setupEventListeners() {
    // Search flights button
    const searchFlightsBtn = document.getElementById('search-flights-btn');
    if (searchFlightsBtn) {
      searchFlightsBtn.addEventListener('click', () => {
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        const departureDate = document.getElementById('departure-date').value;
        const returnDate = document.getElementById('return-date').value;
        const passengers = document.getElementById('passengers').value;
        
        if (origin && destination) {
          this.searchFlights(origin, destination, departureDate, returnDate, passengers);
        } else {
          alert('Please enter origin and destination airports');
        }
      });
    }
    
    // Set today's date as the minimum for the date inputs
    const today = new Date().toISOString().split('T')[0];
    const departureDateInput = document.getElementById('departure-date');
    const returnDateInput = document.getElementById('return-date');
    
    if (departureDateInput) {
      departureDateInput.min = today;
    }
    
    if (returnDateInput) {
      returnDateInput.min = today;
    }
    
    // Update return date min value when departure date changes
    if (departureDateInput && returnDateInput) {
      departureDateInput.addEventListener('change', function() {
        returnDateInput.min = this.value;
      });
    }
    
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all tabs and views
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.flight-view').forEach(view => view.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding view
        button.classList.add('active');
        const viewId = button.dataset.view + '-view';
        document.getElementById(viewId).classList.add('active');
      });
    });
    
    // Global event delegation for bookmarking flights
    document.addEventListener('click', e => {
      if (e.target.closest('.bookmark-button')) {
        const button = e.target.closest('.bookmark-button');
        const card = button.closest('.flight-card');
        
        // Toggle bookmarked state visually
        button.classList.toggle('active');
        
        // Get flight data from the card
        const flight = this.getFlightDataFromCard(card);
        
        // If button has active class, bookmark the flight
        if (button.classList.contains('active')) {
          this.bookmarkFlight(flight);
        } else {
          this.removeBookmark(flight.id);
        }
      }
    });
  },
  
  // Load initial flight data
  loadFlightData() {
    // Get saved flights
    flightAPI.getAllFlights()
      .then(flights => {
        // Display the first 3 flights
        flights.slice(0, 3).forEach(flight => {
          this.addFlightCard(flight);
        });
      })
      .catch(error => {
        console.error('Error loading flight data:', error);
      });
  },
  
  // Load bookmarked flights
  loadBookmarkedFlights() {
    const bookmarksContainer = document.getElementById('bookmarked-flight-cards');
    if (!bookmarksContainer) return;
    
    // Clear container
    bookmarksContainer.innerHTML = '';
    
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
          bookmarksContainer.appendChild(emptyState);
        } else {
          // Add bookmarked flights
          bookmarkedFlights.forEach(flight => {
            this.addFlightCard(flight, false, bookmarksContainer, true);
          });
        }
      })
      .catch(error => {
        console.error('Error loading bookmarked flights:', error);
      });
  },
  
  // Search for flights
  searchFlights(origin, destination, departureDate, returnDate, passengers) {
    const flightCards = document.getElementById('flight-cards');
    if (!flightCards) return;
    
    // Search for flights via API
    flightAPI.searchFlights(origin, destination, departureDate)
      .then(results => {
        // Add new search results at the top
        if (results.length > 0) {
          // Clear existing cards
          flightCards.innerHTML = '';
          
          // Add a heading for search results
          const searchResultsHeading = document.createElement('div');
          searchResultsHeading.className = 'search-results-heading';
          searchResultsHeading.innerHTML = `
            <h3>Search Results: ${results.length} flights found</h3>
            <p>${origin} to ${destination} on ${new Date(departureDate).toLocaleDateString()}</p>
          `;
          flightCards.appendChild(searchResultsHeading);
          
          // Add flight results
          results.forEach(flight => {
            this.addFlightCard(flight, true);
          });
        }
      })
      .catch(error => {
        console.error('Error searching flights:', error);
      });
  },
  
  // Extract flight data from a card element
  getFlightDataFromCard(card) {
    const id = card.dataset.flightId || `flight-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const title = card.querySelector('.card-title').textContent;
    const origin = card.querySelector('.origin').textContent;
    const destination = card.querySelector('.destination').textContent;
    const dateInfo = card.querySelector('.date-info').textContent;
    const price = card.querySelector('.price').textContent;
    const airline = card.querySelector('.airline-name').textContent;
    
    // Parse dates from date info
    let departureDate = '';
    let returnDate = '';
    
    const departMatch = dateInfo.match(/Depart: ([^·]+)/);
    if (departMatch) {
      departureDate = departMatch[1].trim();
    }
    
    const returnMatch = dateInfo.match(/Return: ([^·]+)/);
    if (returnMatch) {
      returnDate = returnMatch[1].trim();
    }
    
    return {
      id,
      origin,
      destination,
      departureDate,
      returnDate,
      price,
      airline
    };
  },
  
  // Add a flight card
  addFlightCard(flight, prepend = false, container = null, isBookmarked = false) {
    const flightCards = container || document.getElementById('flight-cards');
    if (!flightCards) return;
    
    const card = document.importNode(document.getElementById('flight-card-template').content, true);
    const cardElement = card.querySelector('.flight-card');
    
    // Store flight ID on the card element for easy retrieval
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
    
    // Check if this flight is bookmarked and update the bookmark button
    if (isBookmarked) {
      card.querySelector('.bookmark-button').classList.add('active');
    } else {
      // If not already set, check against local storage
      flightAPI.isFlightBookmarked(flight.id).then(isBookmarked => {
        if (isBookmarked) {
          const addedCard = flightCards.querySelector(`[data-flight-id="${flight.id}"]`);
          if (addedCard) {
            addedCard.querySelector('.bookmark-button').classList.add('active');
          }
        }
      });
    }
    
    // Add to top of list for search results, otherwise add to end
    if (prepend) {
      flightCards.appendChild(card);
    } else {
      flightCards.appendChild(card);
    }
  },
  
  // Bookmark a flight
  bookmarkFlight(flight) {
    flightAPI.bookmarkFlight(flight).then(() => {
      this.loadBookmarkedFlights();
      
      // Show toast notification
      this.showToast(`Flight from ${flight.origin} to ${flight.destination} has been bookmarked!`);
    });
  },
  
  // Remove a flight from bookmarks
  removeBookmark(flightId) {
    flightAPI.removeBookmark(flightId).then(() => {
      this.loadBookmarkedFlights();
      
      // Update the bookmark button in search view if applicable
      const searchViewCard = document.querySelector(`#flight-cards [data-flight-id="${flightId}"]`);
      if (searchViewCard) {
        searchViewCard.querySelector('.bookmark-button').classList.remove('active');
      }
    });
  },
  
  // Handle delete button click
  handleDelete(card) {
    const flightId = card.dataset.flightId;
    
    flightAPI.deleteFlight(flightId).then(() => {
      card.remove();
      
      // If it was a bookmarked flight, refresh bookmarks
      this.loadBookmarkedFlights();
      
      // If we're removing a search result and there are no more, remove the heading too
      const flightCards = document.getElementById('flight-cards');
      const searchResultsHeading = flightCards.querySelector('.search-results-heading');
      
      if (searchResultsHeading && !searchResultsHeading.nextElementSibling) {
        searchResultsHeading.remove();
      }
    });
  },
  
  // Show a toast notification
  showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
      toast.classList.add('show');
      
      // Hide and remove the toast after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 100);
  }
};
