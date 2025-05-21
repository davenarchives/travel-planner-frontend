
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
    
    // Bookmark tab click event
    document.addEventListener('click', (e) => {
      if (e.target.closest('#bookmark-tab-btn')) {
        this.showBookmarksTab();
      }
      
      if (e.target.closest('#search-tab-btn')) {
        this.showSearchTab();
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
        
        // Set up tabs
        this.setupTabs();
        
        // Load bookmarked flights
        this.loadBookmarkedFlights();
      })
      .catch(error => {
        console.error('Error loading flight data:', error);
      });
  },
  
  setupTabs() {
    // Create tabs if they don't exist
    const flightCardsContainer = document.getElementById('flight-cards');
    if (!flightCardsContainer) return;
    
    // Check if tabs exist
    if (!document.getElementById('flight-tabs')) {
      const tabsContainer = document.createElement('div');
      tabsContainer.id = 'flight-tabs';
      tabsContainer.className = 'tabs-container';
      tabsContainer.innerHTML = `
        <div class="tabs-header">
          <button id="search-tab-btn" class="tab-button active">Search Results</button>
          <button id="bookmark-tab-btn" class="tab-button">Bookmarks</button>
        </div>
        <div id="search-tab" class="tab-content active">
          <div id="search-results" class="card-grid"></div>
        </div>
        <div id="bookmark-tab" class="tab-content">
          <div id="bookmarked-flights" class="card-grid"></div>
        </div>
      `;
      
      // Move existing cards into the search results tab
      const searchResults = tabsContainer.querySelector('#search-results');
      Array.from(flightCardsContainer.children).forEach(child => {
        searchResults.appendChild(child);
      });
      
      flightCardsContainer.appendChild(tabsContainer);
    }
  },
  
  showBookmarksTab() {
    document.getElementById('search-tab-btn').classList.remove('active');
    document.getElementById('bookmark-tab-btn').classList.add('active');
    document.getElementById('search-tab').classList.remove('active');
    document.getElementById('bookmark-tab').classList.add('active');
  },
  
  showSearchTab() {
    document.getElementById('bookmark-tab-btn').classList.remove('active');
    document.getElementById('search-tab-btn').classList.add('active');
    document.getElementById('bookmark-tab').classList.remove('active');
    document.getElementById('search-tab').classList.add('active');
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
          // Make sure search tab is visible
          this.showSearchTab();
          
          // Get the search results container
          const searchResults = document.getElementById('search-results');
          
          // Add a heading for search results
          if (searchResults) {
            // Clear previous search results
            searchResults.innerHTML = '';
            
            const searchResultsHeading = document.createElement('div');
            searchResultsHeading.className = 'search-results-heading';
            searchResultsHeading.innerHTML = `
              <h3>Search Results: ${results.length} flights found</h3>
              <p>${origin} to ${destination} on ${new Date(departureDate).toLocaleDateString()}</p>
            `;
            searchResults.appendChild(searchResultsHeading);
            
            // Add flight results
            results.forEach(flight => {
              this.addFlightCard(flight, true);
            });
          }
        }
      })
      .catch(error => {
        console.error('Error searching flights:', error);
      });
  },
  
  // Add a flight card
  addFlightCard(flight, prepend = false) {
    let container = document.getElementById('search-results');
    if (!container) {
      container = document.getElementById('flight-cards');
    }
    if (!container) return;
    
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
    
    // Setup bookmark button
    const bookmarkButton = card.querySelector('.bookmark-button');
    if (bookmarkButton) {
      // Check if this flight is already bookmarked
      const isBookmarked = this.isFlightBookmarked(flight);
      if (isBookmarked) {
        bookmarkButton.innerHTML = '<i class="fas fa-bookmark"></i>';
        bookmarkButton.classList.add('bookmarked');
      } else {
        bookmarkButton.innerHTML = '<i class="far fa-bookmark"></i>';
      }
      
      // Add bookmark functionality
      bookmarkButton.addEventListener('click', () => {
        this.handleBookmark(bookmarkButton, flight);
      });
    }
    
    // Add to top of list for search results, otherwise add to end
    if (prepend && container.firstChild) {
      container.insertBefore(card, container.firstChild.nextSibling); // After the heading
    } else {
      container.appendChild(card);
    }
  },
  
  // Check if a flight is bookmarked
  isFlightBookmarked(flight) {
    const bookmarkedFlights = this.getBookmarkedFlights();
    return bookmarkedFlights.some(bookmarked => 
      bookmarked.origin === flight.origin && 
      bookmarked.destination === flight.destination && 
      bookmarked.departureDate === flight.departureDate
    );
  },
  
  // Handle flight bookmark functionality
  handleBookmark(button, flight) {
    if (button.classList.contains('bookmarked')) {
      // Remove bookmark
      button.innerHTML = '<i class="far fa-bookmark"></i>';
      button.classList.remove('bookmarked');
      this.removeBookmarkedFlight(flight);
    } else {
      // Add bookmark
      button.innerHTML = '<i class="fas fa-bookmark"></i>';
      button.classList.add('bookmarked');
      this.addBookmarkedFlight(flight);
    }
    
    // Update bookmarks tab
    this.loadBookmarkedFlights();
  },
  
  // Load bookmarked flights from localStorage
  getBookmarkedFlights() {
    try {
      const bookmarks = localStorage.getItem('bookmarkedFlights');
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (e) {
      console.error('Error loading bookmarked flights:', e);
      return [];
    }
  },
  
  // Add a flight to bookmarks
  addBookmarkedFlight(flight) {
    try {
      const bookmarkedFlights = this.getBookmarkedFlights();
      
      // Check if flight is already bookmarked
      const isDuplicate = this.isFlightBookmarked(flight);
      if (!isDuplicate) {
        bookmarkedFlights.push(flight);
        localStorage.setItem('bookmarkedFlights', JSON.stringify(bookmarkedFlights));
      }
    } catch (e) {
      console.error('Error saving bookmarked flight:', e);
    }
  },
  
  // Remove a flight from bookmarks
  removeBookmarkedFlight(flight) {
    try {
      let bookmarkedFlights = this.getBookmarkedFlights();
      bookmarkedFlights = bookmarkedFlights.filter(bookmarked => 
        !(bookmarked.origin === flight.origin && 
          bookmarked.destination === flight.destination && 
          bookmarked.departureDate === flight.departureDate)
      );
      localStorage.setItem('bookmarkedFlights', JSON.stringify(bookmarkedFlights));
    } catch (e) {
      console.error('Error removing bookmarked flight:', e);
    }
  },
  
  // Load bookmarked flights into the bookmarks tab
  loadBookmarkedFlights() {
    const bookmarksContainer = document.getElementById('bookmarked-flights');
    if (!bookmarksContainer) return;
    
    // Clear current bookmarks
    bookmarksContainer.innerHTML = '';
    
    // Get bookmarked flights
    const bookmarkedFlights = this.getBookmarkedFlights();
    
    // Add bookmarks to container
    if (bookmarkedFlights.length > 0) {
      bookmarkedFlights.forEach(flight => {
        this.addBookmarkedFlightCard(flight, bookmarksContainer);
      });
    } else {
      // Show message if no bookmarks
      const noBookmarksMsg = document.createElement('div');
      noBookmarksMsg.className = 'no-bookmarks-message';
      noBookmarksMsg.textContent = 'No bookmarked flights. Click the bookmark icon on flights to save them here.';
      bookmarksContainer.appendChild(noBookmarksMsg);
    }
  },
  
  // Add a bookmarked flight card
  addBookmarkedFlightCard(flight, container) {
    const template = document.importNode(document.getElementById('flight-card-template').content, true);
    
    template.querySelector('.card-title').textContent = `Flight ${flight.origin} - ${flight.destination}`;
    template.querySelector('.origin').textContent = flight.origin;
    template.querySelector('.destination').textContent = flight.destination;
    
    // Format dates
    const formattedDepartDate = flight.departureDate ? new Date(flight.departureDate).toLocaleDateString() : '';
    let dateText = `Depart: ${formattedDepartDate}`;
    
    if (flight.returnDate) {
      const formattedReturnDate = new Date(flight.returnDate).toLocaleDateString();
      dateText += ` · Return: ${formattedReturnDate}`;
    }
    
    template.querySelector('.date-info').textContent = dateText;
    template.querySelector('.price').textContent = flight.price;
    template.querySelector('.airline-name').textContent = flight.airline;
    
    // Setup bookmark button (always filled for bookmarked flights)
    const bookmarkButton = template.querySelector('.bookmark-button');
    if (bookmarkButton) {
      bookmarkButton.innerHTML = '<i class="fas fa-bookmark"></i>';
      bookmarkButton.classList.add('bookmarked');
      
      // Add remove bookmark functionality
      bookmarkButton.addEventListener('click', () => {
        this.removeBookmarkedFlight(flight);
        // Update bookmarks tab
        this.loadBookmarkedFlights();
        // Update search tab bookmarks
        this.updateSearchTabBookmarks();
      });
    }
    
    container.appendChild(template);
  },
  
  // Update bookmark icons in search tab
  updateSearchTabBookmarks() {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    const flightCards = searchResults.querySelectorAll('.flight-card');
    flightCards.forEach(card => {
      const origin = card.querySelector('.origin').textContent;
      const destination = card.querySelector('.destination').textContent;
      const dateInfo = card.querySelector('.date-info').textContent;
      const departureDateMatch = dateInfo.match(/Depart: ([^·]+)/);
      let departureDate = '';
      if (departureDateMatch && departureDateMatch[1]) {
        departureDate = departureDateMatch[1].trim();
      }
      
      // Create a flight object to check if it's bookmarked
      const flight = { origin, destination, departureDate };
      
      const bookmarkButton = card.querySelector('.bookmark-button');
      if (bookmarkButton) {
        const isBookmarked = this.isFlightBookmarked(flight);
        if (isBookmarked) {
          bookmarkButton.innerHTML = '<i class="fas fa-bookmark"></i>';
          bookmarkButton.classList.add('bookmarked');
        } else {
          bookmarkButton.innerHTML = '<i class="far fa-bookmark"></i>';
          bookmarkButton.classList.remove('bookmarked');
        }
      }
    });
  },
  
  // Handle delete button click
  handleDelete(card) {
    // Get flight data before removing the card
    const origin = card.querySelector('.origin').textContent;
    const destination = card.querySelector('.destination').textContent;
    const dateInfo = card.querySelector('.date-info').textContent;
    const departureDateMatch = dateInfo.match(/Depart: ([^·]+)/);
    let departureDate = '';
    if (departureDateMatch && departureDateMatch[1]) {
      departureDate = departureDateMatch[1].trim();
    }
    
    // Remove from bookmarks if it's there
    this.removeBookmarkedFlight({ origin, destination, departureDate });
    
    // Remove card from DOM
    card.remove();
    
    // If we're removing a search result and there are no more, remove the heading too
    const flightCards = document.getElementById('flight-cards');
    const searchResultsHeading = flightCards.querySelector('.search-results-heading');
    
    if (searchResultsHeading && !searchResultsHeading.nextElementSibling) {
      searchResultsHeading.remove();
    }
    
    // Update bookmarks tab
    this.loadBookmarkedFlights();
  },
  
  // Handle edit button click (now handles bookmark functionality)
  handleEdit(card) {
    // Find the bookmark button in the card and click it
    const bookmarkButton = card.querySelector('.bookmark-button');
    if (bookmarkButton) {
      bookmarkButton.click();
    }
  }
};
