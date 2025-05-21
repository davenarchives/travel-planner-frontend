
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
  
  // Search for flights
  searchFlights(origin, destination, departureDate, returnDate, passengers) {
    const flightCards = document.getElementById('flight-cards');
    if (!flightCards) return;
    
    // Search for flights via API
    flightAPI.searchFlights(origin, destination, departureDate)
      .then(results => {
        // Add new search results at the top
        if (results.length > 0) {
          // Add a heading for search results
          const searchResultsHeading = document.createElement('div');
          searchResultsHeading.className = 'search-results-heading';
          searchResultsHeading.innerHTML = `
            <h3>Search Results: ${results.length} flights found</h3>
            <p>${origin} to ${destination} on ${new Date(departureDate).toLocaleDateString()}</p>
          `;
          flightCards.insertBefore(searchResultsHeading, flightCards.firstChild);
          
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
  
  // Add a flight card
  addFlightCard(flight, prepend = false) {
    const flightCards = document.getElementById('flight-cards');
    if (!flightCards) return;
    
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
    
    // Add to top of list for search results, otherwise add to end
    if (prepend) {
      flightCards.insertBefore(card, flightCards.firstChild.nextSibling); // After the heading
    } else {
      flightCards.appendChild(card);
    }
  },
  
  // Handle delete button click
  handleDelete(card) {
    card.remove();
    
    // If we're removing a search result and there are no more, remove the heading too
    const flightCards = document.getElementById('flight-cards');
    const searchResultsHeading = flightCards.querySelector('.search-results-heading');
    
    if (searchResultsHeading && !searchResultsHeading.nextElementSibling) {
      searchResultsHeading.remove();
    }
  },
  
  // Handle edit button click
  handleEdit(card) {
    // Toggle "Saved" label
    const title = card.querySelector('.card-title');
    
    if (title.textContent.includes('[Saved]')) {
      title.textContent = title.textContent.replace(' [Saved]', '');
    } else {
      title.textContent = `${title.textContent} [Saved]`;
    }
  }
};
