import { getTemplate } from "../../js/templates.js"
import { countryAPI } from "../../js/api/countryAPI.js"

export const countryModule = {
  // Mock data for countries (will be replaced with API data)
  countryData: [
    {
      name: "Japan",
      capital: "Tokyo",
      population: "126.3 million",
      region: "Asia",
      flag: "🇯🇵",
      tags: ["Bucket List", "Cherry Blossoms"],
      cities: ["Tokyo", "Kyoto", "Osaka"],
    },
    {
      name: "Italy",
      capital: "Rome",
      population: "60.4 million",
      region: "Europe",
      flag: "🇮🇹",
      tags: ["Food", "History"],
      cities: ["Rome", "Florence", "Venice"],
    },
    {
      name: "New Zealand",
      capital: "Wellington",
      population: "4.9 million",
      region: "Oceania",
      flag: "🇳🇿",
      tags: ["Nature", "Adventure"],
      cities: ["Auckland", "Wellington", "Queenstown"],
    },
  ],

  init(container) {
    // Create the country module view
    const template = getTemplate("country-template")
    container.appendChild(template)

    // Load initial data
    this.loadCountryData()

    // Set up event listeners
    this.setupEventListeners()
  },

  setupEventListeners() {
    // Add country button
    const addCountryBtn = document.getElementById("add-country-btn")
    if (addCountryBtn) {
      addCountryBtn.addEventListener("click", () => {
        const input = document.getElementById("country-search-input")
        if (input && input.value.trim() !== "") {
          this.fetchAndAddCountry(input.value.trim())
          input.value = ""
        }
      })
    }

    // Enter key in input field
    const countryInput = document.getElementById("country-search-input")
    if (countryInput) {
      countryInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          document.getElementById("add-country-btn")?.click()
        }
      })
    }
  },

  async loadCountryData() {
    try {
      // Try to fetch countries from API
      const countries = await countryAPI.getAllCountries()
      if (countries && countries.length > 0) {
        // If API returns countries, use them
        countries.forEach((country) => {
          this.addCountryCard(country.name, country)
        })
      } else {
        // Fallback to mock data if API fails or returns empty
        this.countryData.forEach((country) => {
          this.addCountryCard(country.name, country)
        })
      }
    } catch (error) {
      console.error("Error loading countries, using mock data:", error)
      // Fallback to mock data
      this.countryData.forEach((country) => {
        this.addCountryCard(country.name, country)
      })
    }
  },

  async fetchAndAddCountry(name) {
    try {
      // Show loading state
      const loadingEl = document.createElement("div")
      loadingEl.className = "loading-message"
      loadingEl.textContent = `Loading ${name}...`
      document.getElementById("country-cards")?.appendChild(loadingEl)

      // Try to fetch from API
      const country = await countryAPI.getCountry(name)

      // Remove loading message
      loadingEl.remove()

      if (country) {
        this.addCountryCard(country.name, country)
      } else {
        throw new Error("Country not found")
      }
    } catch (error) {
      console.error(`Error fetching country ${name}:`, error)

      // Remove loading message if it exists
      document.querySelector(".loading-message")?.remove()

      // Add with placeholder data
      this.addCountryCard(name)

      // Show error message
      const errorEl = document.createElement("div")
      errorEl.className = "error-message"
      errorEl.textContent = `Could not fetch data for ${name} from API. Using placeholder data.`
      errorEl.style.cssText = "color: #ef4444; font-size: 0.8rem; margin-top: 0.5rem;"

      // Find the card we just added and append error message
      const cards = document.querySelectorAll(".card")
      const lastCard = cards[cards.length - 1]
      lastCard.querySelector(".card-content").appendChild(errorEl)

      // Auto-remove error after 5 seconds
      setTimeout(() => {
        errorEl.remove()
      }, 5000)
    }
  },

  addCountryCard(name, data) {
    const countryCards = document.getElementById("country-cards")
    if (!countryCards) return

    // Use provided data or generate placeholder data
    const country = data || {
      capital: "Sample Capital",
      population: "Unknown",
      region: "Unknown",
      flag: "🏳️",
      tags: ["New"],
      cities: [],
    }

    const template = getTemplate("country-card-template")

    template.querySelector(".card-title").textContent = `${country.flag || ""} ${name}`
    template.querySelector(".capital").textContent = country.capital
    template.querySelector(".population").textContent = country.population
    template.querySelector(".region").textContent = country.region

    const tagsContainer = template.querySelector(".tags-container")
    tagsContainer.innerHTML = "" // Clear any existing tags

    country.tags.forEach((tag) => {
      const tagElement = document.createElement("span")
      tagElement.className = "tag"
      tagElement.textContent = tag
      tagsContainer.appendChild(tagElement)
    })

    // Add cities section
    const cardContent = template.querySelector(".card-content")

    // Create cities section
    const citySection = document.createElement("div")
    citySection.className = "city-section"

    const cityHeading = document.createElement("h4")
    cityHeading.className = "city-heading"
    cityHeading.textContent = "Cities"
    citySection.appendChild(cityHeading)

    // Add city input
    const cityInputContainer = document.createElement("div")
    cityInputContainer.className = "city-input-container"

    const cityInput = document.createElement("input")
    cityInput.type = "text"
    cityInput.className = "form-input city-input"
    cityInput.placeholder = "Add a city..."

    const addCityBtn = document.createElement("button")
    addCityBtn.className = "primary-button add-city-btn"
    addCityBtn.textContent = "Add"

    cityInputContainer.appendChild(cityInput)
    cityInputContainer.appendChild(addCityBtn)
    citySection.appendChild(cityInputContainer)

    // Create city list
    const cityList = document.createElement("div")
    cityList.className = "city-list"

    // Add existing cities
    if (country.cities && country.cities.length > 0) {
      country.cities.forEach((city) => {
        const cityItem = this.createCityItem(city, name)
        cityList.appendChild(cityItem)
      })
    }

    citySection.appendChild(cityList)
    cardContent.appendChild(citySection)

    // Add event listener for adding cities
    addCityBtn.addEventListener("click", () => {
      const cityName = cityInput.value.trim()
      if (cityName) {
        // Add to UI
        const cityItem = this.createCityItem(cityName, name)
        cityList.appendChild(cityItem)
        cityInput.value = ""

        // Update cities array
        const cities = Array.from(cityList.querySelectorAll(".city-item")).map(
          (item) => item.querySelector("span").textContent,
        )

        // Update via API
        this.updateCities(name, cities)
      }
    })

    // Enter key for city input
    cityInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault()
        addCityBtn.click()
      }
    })

    // Add the card to the grid
    countryCards.appendChild(template)

    // Set up event listeners for card actions
    const deleteBtn = template.querySelector(".delete-button")
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => this.handleDelete(template))
    }

    const editBtn = template.querySelector(".edit-button")
    if (editBtn) {
      editBtn.addEventListener("click", () => this.handleEdit(template))
    }
  },

  createCityItem(cityName, countryName) {
    const cityItem = document.createElement("div")
    cityItem.className = "city-item"

    const cityText = document.createElement("span")
    cityText.textContent = cityName

    const removeBtn = document.createElement("button")
    removeBtn.className = "remove-city-btn"
    removeBtn.innerHTML = "&times;"
    removeBtn.title = "Remove city"

    removeBtn.addEventListener("click", () => {
      cityItem.remove()

      // Get updated list of cities
      const cityList = cityItem.parentElement
      const cities = Array.from(cityList.querySelectorAll(".city-item")).map(
        (item) => item.querySelector("span").textContent,
      )

      // Update via API
      this.updateCities(countryName, cities)
    })

    cityItem.appendChild(cityText)
    cityItem.appendChild(removeBtn)

    return cityItem
  },

  async updateCities(countryName, cities) {
    try {
      await countryAPI.updateCities(countryName, cities)
      console.log(`Cities updated for ${countryName}`)
    } catch (error) {
      console.error(`Error updating cities for ${countryName}:`, error)
      // Show error message
      alert(`Failed to update cities for ${countryName}. Please try again.`)
    }
  },

  handleDelete(card) {
    // In a real app, this would call an API to delete the data
    card.remove()
    console.log("Country card deleted")
  },

  handleEdit(card) {
    // In a real app, this would open an edit form
    const country = card.querySelector(".card-title").textContent
    console.log(`Editing country card for ${country}`)

    // Simple demonstration - add a new tag
    const tagsContainer = card.querySelector(".tags-container")
    const newTags = ["Favorite", "Must Visit", "Budget Friendly", "Family Friendly"]
    const randomTag = newTags[Math.floor(Math.random() * newTags.length)]

    const tagElement = document.createElement("span")
    tagElement.className = "tag"
    tagElement.textContent = randomTag
    tagsContainer.appendChild(tagElement)
  },
}
