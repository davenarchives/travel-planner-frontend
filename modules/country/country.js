import { getTemplate } from "../../js/templates.js"
import { countryAPI } from "../../js/api/countryAPI.js"

export const countryModule = {
  init(container) {
    // Create the country module view
    const template = getTemplate("country-template")
    container.appendChild(template)

    // Show initial message
    this.showInitialMessage()

    // Set up event listeners
    this.setupEventListeners()
  },

  showInitialMessage() {
    const countryCards = document.getElementById("country-cards")
    if (countryCards) {
      countryCards.innerHTML = `
      <div class="no-data">
        <i class="fas fa-globe fa-3x mb-3"></i>
        <h3>Search for Countries</h3>
        <p>Use the search bar above to explore country information.</p>
      </div>
    `
    }
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

  async fetchAndAddCountry(name) {
    const countryCards = document.getElementById("country-cards")
    if (!countryCards) return

    // Clear the initial message if it exists
    const noDataElement = countryCards.querySelector(".no-data")
    if (noDataElement) {
      noDataElement.remove()
    }

    try {
      // Show loading state
      const loadingEl = document.createElement("div")
      loadingEl.className = "loading-message card"
      loadingEl.innerHTML = `
      <div class="card-content text-center p-4">
        <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <p>Loading ${name}...</p>
      </div>
    `
      countryCards.appendChild(loadingEl)

      // Try to fetch from API
      const country = await countryAPI.getCountryInfo(name)

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

      // Show error message
      const errorEl = document.createElement("div")
      errorEl.className = "error-message card"
      errorEl.innerHTML = `
      <div class="card-content text-center p-4">
        <i class="fas fa-exclamation-circle fa-2x mb-3" style="color: #ef4444;"></i>
        <p>Could not fetch data for "${name}". Please check the country name and try again.</p>
      </div>
    `
      countryCards.appendChild(errorEl)

      // Auto-remove error after 5 seconds
      setTimeout(() => {
        errorEl.remove()
      }, 5000)
    }
  },

  addCountryCard(name, data) {
    const countryCards = document.getElementById("country-cards")
    if (!countryCards) return

    const template = getTemplate("country-card-template")

    template.querySelector(".card-title").textContent = `${data.flag || ""} ${name}`
    template.querySelector(".capital").textContent = data.capital || "Unknown"
    template.querySelector(".population").textContent = this.formatPopulation(data.population) || "Unknown"
    template.querySelector(".region").textContent = data.region || "Unknown"

    const tagsContainer = template.querySelector(".tags-container")
    tagsContainer.innerHTML = "" // Clear any existing tags

    const tags = data.tags || []
    tags.forEach((tag) => {
      const tagElement = document.createElement("span")
      tagElement.className = "tag"
      tagElement.textContent = tag
      tagsContainer.appendChild(tagElement)
    })

    // Add the card to the grid
    countryCards.appendChild(template)

    // Set up event listeners for card actions
    const deleteBtn = template.querySelector(".delete-button")
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => this.handleDelete(template))
    }

    const bookmarkBtn = template.querySelector(".bookmark-button")
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", () => this.handleBookmark(template))
    }
  },

  formatPopulation(population) {
    // Handle both string and number formats
    if (typeof population === "string") {
      // If it's already formatted (like "125,836,021"), return as is but convert to readable format
      if (population.includes(",")) {
        const num = parseInt(population.replace(/,/g, ""))
        if (num >= 1000000) {
          return `${(num / 1000000).toFixed(1)} million`
        } else if (num >= 1000) {
          return `${(num / 1000).toFixed(1)}k`
        }
        return population
      }
      return population
    }

    if (typeof population === "number") {
      if (population >= 1000000) {
        return `${(population / 1000000).toFixed(1)} million`
      } else if (population >= 1000) {
        return `${(population / 1000).toFixed(1)}k`
      }
      return population.toString()
    }

    return population
  },

  handleDelete(card) {
    // In a real app, this would call an API to delete the data
    card.remove()
    console.log("Country card deleted")
  },

  handleBookmark(card) {
    // Simple demonstration - toggle bookmark state
    const bookmarkButton = card.querySelector(".bookmark-button")
    const country = card.querySelector(".card-title").textContent

    if (bookmarkButton.classList.contains("active")) {
      bookmarkButton.classList.remove("active")
      bookmarkButton.querySelector("i").classList.remove("active")
      console.log(`Removed bookmark for ${country}`)
    } else {
      bookmarkButton.classList.add("active")
      bookmarkButton.querySelector("i").classList.add("active")
      console.log(`Bookmarked ${country}`)
    }
  },
}