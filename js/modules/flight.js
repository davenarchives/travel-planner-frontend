
import { getTemplate } from '../templates.js';

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
  },
  
  loadFlightData() {
    this.flightData.forEach(flight => {
      this.addFlightCard(flight.origin, flight.destination, flight.departureDate, flight.returnDate, null, flight);
    });
  },
  
  addFlightCard(origin, destination, departureDate, returnDate, passengers, flightData) {
    const flightCards = document.getElementById('flight-cards');
    if (!flightCards) return;
    
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
    
    // Add the card to the grid
    flightCards.appendChild(template);
  },
  
  handleDelete(card) {
    // In a real app, this would call an API to delete the data
    card.remove();
    console.log('Flight card deleted');
  },
  
  handleEdit(card) {
    // In a real app, this would open an edit form
    const flight = card.querySelector('.card-title').textContent;
    console.log(`Editing flight card: ${flight}`);
    
    // Simple demonstration - update the price
    const priceElement = card.querySelector('.price');
    const currentPrice = parseInt(priceElement.textContent.replace('$', '').replace(',', ''));
    const newPrice = Math.floor(currentPrice * 0.9); // 10% discount
    priceElement.textContent = `$${newPrice}`;
    priceElement.style.color = '#10b981'; // Green color to indicate discount
  }
};
