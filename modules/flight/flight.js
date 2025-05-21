
import { getTemplate } from '../../js/templates.js';

export const flightModule = {
  // Mock data for flights
  flightData: [
    {
      origin: 'New York (JFK)',
      destination: 'London (LHR)',
      departureDate: '2025-06-15',
      returnDate: '2025-06-22',
      price: '$850',
      airline: 'British Airways'
    },
    {
      origin: 'San Francisco (SFO)',
      destination: 'Tokyo (NRT)',
      departureDate: '2025-07-10',
      returnDate: '2025-07-25',
      price: '$1,200',
      airline: 'JAL'
    },
    {
      origin: 'Miami (MIA)',
      destination: 'Barcelona (BCN)',
      departureDate: '2025-08-05',
      returnDate: '2025-08-19',
      price: '$980',
      airline: 'Iberia'
    }
  ],
  
  init(container) {
    // Create the flight module view
    const template = getTemplate('flight-template');
    container.appendChild(template);
    
    // Load initial data
    this.loadFlightData();
    
    // Set up event listeners
    this.setupEventListeners();
  },
  
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
        
        if (origin && destination && departureDate) {
          this.addFlightCard(origin, destination, departureDate, returnDate, passengers);
        }
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
  
  loadFlightData() {
    this.flightData.forEach(flight => {
      this.addFlightCard(flight.origin, flight.destination, flight.departureDate, flight.returnDate, null, flight);
    });
    
    // Set up tabs
    this.setupTabs();
    
    // Load bookmarked flights
    this.loadBookmarkedFlights();
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
  
  addFlightCard(origin, destination, departureDate, returnDate, passengers, flightData) {
    let container = document.getElementById('search-results');
    if (!container) {
      container = document.getElementById('flight-cards');
    }
    if (!container) return;
    
    // Format dates
    const formattedDepartDate = departureDate ? new Date(departureDate).toLocaleDateString() : '';
    let dateText = `Depart: ${formattedDepartDate}`;
    
    if (returnDate) {
      const formattedReturnDate = new Date(returnDate).toLocaleDateString();
      dateText += ` · Return: ${formattedReturnDate}`;
    }
    
    // Use provided data or generate placeholder data
    let flight;
    if (flightData) {
      flight = flightData;
    } else {
      // Generate random flight data
      const airlines = ['American Airlines', 'Delta', 'United', 'Lufthansa', 'Emirates'];
      const randomPrice = Math.floor(Math.random() * 1000) + 500;
      
      flight = {
        origin: origin,
        destination: destination,
        departureDate: departureDate,
        returnDate: returnDate,
        price: `$${randomPrice}`,
        airline: airlines[Math.floor(Math.random() * airlines.length)]
      };
    }
    
    const template = getTemplate('flight-card-template');
    
    template.querySelector('.card-title').textContent = `Flight ${flight.origin} - ${flight.destination}`;
    template.querySelector('.origin').textContent = flight.origin;
    template.querySelector('.destination').textContent = flight.destination;
    template.querySelector('.date-info').textContent = dateText;
    template.querySelector('.price').textContent = flight.price;
    template.querySelector('.airline-name').textContent = flight.airline;
    
    // Setup bookmark button
    const bookmarkButton = template.querySelector('.bookmark-button');
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
    
    // Add the card to the container
    container.appendChild(template);
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
    const template = getTemplate('flight-card-template');
    
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
  
  handleDelete(card) {
    // In a real app, this would call an API to delete the data
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
    console.log('Flight card deleted');
    
    // Update bookmarks tab
    this.loadBookmarkedFlights();
  },
  
  handleEdit(card) {
    // This is now handled by the handleBookmark method
    console.log('Edit functionality replaced by bookmarks');
  }
};
