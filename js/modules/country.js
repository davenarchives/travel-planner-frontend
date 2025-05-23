import { countryAPI } from "../api/countryAPI.js"
import { getTemplate } from "../utils/templatesUtil.js"

export const countryModule = {
  init(container) {
    const template = getTemplate("country-template")
    container.appendChild(template)
    this.loadCountryData()
    this.setupEventListeners()
  },

  setupEventListeners() {
    const addCountryBtn = document.getElementById("add-country-btn")
    if (addCountryBtn) {
      addCountryBtn.addEventListener("click", () => {
        const input = document.getElementById("country-search-input")
        if (input && input.value.trim() !== "") {
          this.addCountry(input.value.trim())
          input.value = ""
        }
      })
    }

    const countryInput = document.getElementById("country-search-input")
    if (countryInput) {
      countryInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          document.getElementById("add-country-btn")?.click()
        }
      })
    }

    // Event delegation for bookmark and delete buttons
    document.addEventListener("click", (event) => {
      const card = event.target.closest(".card")
      if (!card) return

      if (event.target.closest(".bookmark-button")) {
        this.handleBookmark(card)
      } else if (event.target.closest(".delete-button")) {
        this.handleDelete(card)
      }
    })
  },

  loadCountryData() {
    // Load initial country data from the API
    countryAPI
      .getAllCountries()
      .then((countries) => {
        if (countries && countries.length > 0) {
          // We'll just load the first three countries or as many as available
          const initialCountries = countries.slice(0, 3)
          initialCountries.forEach((countryData) => {
            this.addCountryFromData(countryData)
          })
        } else {
          console.warn("No countries returned from API")
          // Show a message to the user
          const countryCards = document.getElementById("country-cards")
          if (countryCards) {
            countryCards.innerHTML = `
              <div class="no-data">
                <i class="fas fa-globe fa-3x mb-3"></i>
                <h3>No Countries Found</h3>
                <p>Try adding a country using the search bar above.</p>
              </div>
            `
          }
        }
      })
      .catch((error) => {
        console.error("Error loading initial country data:", error)
        // Fallback to default countries if API fails
        const countries = ["Japan", "Italy", "New Zealand"]
        countries.forEach((country) => {
          this.addCountry(country)
        })
      })
  },

  addCountry(countryName) {
    const countryCards = document.getElementById("country-cards")
    if (!countryCards) return

    // Show loading state
    const loadingCard = document.createElement("div")
    loadingCard.className = "card loading-card"
    loadingCard.innerHTML = `
      <div class="card-content text-center p-4">
        <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <p>Loading ${countryName}...</p>
      </div>
    `
    countryCards.appendChild(loadingCard)

    countryAPI
      .getCountryInfo(countryName)
      .then((country) => {
        // Remove loading card
        loadingCard.remove()

        if (country) {
          this.addCountryFromData(country)
        } else {
          console.error(`Country ${countryName} not found`)
          // Show error message
          const errorCard = document.createElement("div")
          errorCard.className = "card error-card"
          errorCard.innerHTML = `
            <div class="card-content text-center p-4">
              <i class="fas fa-exclamation-circle fa-2x mb-3" style="color: var(--secondary-color);"></i>
              <p>Country "${countryName}" not found. Please try another country.</p>
            </div>
          `
          countryCards.appendChild(errorCard)

          // Remove error message after 3 seconds
          setTimeout(() => {
            errorCard.remove()
          }, 3000)
        }
      })
      .catch((error) => {
        // Remove loading card
        loadingCard.remove()
        console.error("Error loading country data:", error)

        // Show error message
        const errorCard = document.createElement("div")
        errorCard.className = "card error-card"
        errorCard.innerHTML = `
          <div class="card-content text-center p-4">
            <i class="fas fa-exclamation-circle fa-2x mb-3" style="color: var(--secondary-color);"></i>
            <p>Error loading country data. Please try again.</p>
          </div>
        `
        countryCards.appendChild(errorCard)

        // Remove error message after 3 seconds
        setTimeout(() => {
          errorCard.remove()
        }, 3000)
      })
  },

  addCountryFromData(country) {
    const countryCards = document.getElementById("country-cards")
    if (!countryCards) return

    const card = document.importNode(document.getElementById("country-card-template").content, true)

    card.querySelector(".card-title").textContent = `${country.flag || ""} ${country.name}`
    card.querySelector(".capital").textContent = country.capital || "Unknown"
    card.querySelector(".population").textContent = country.population
      ? this.formatPopulation(country.population)
      : "Unknown"
    card.querySelector(".region").textContent = country.region || "Unknown"

    const tagsContainer = card.querySelector(".tags-container")
    tagsContainer.innerHTML = ""

    // Check if tags exist, if not use an empty array
    const tags = country.tags || []
    tags.forEach((tag) => {
      const tagElement = document.createElement("span")
      tagElement.className = "tag"
      tagElement.textContent = tag
      tagsContainer.appendChild(tagElement)
    })

    const countryId = `country-${country.name.toLowerCase().replace(/\s/g, "-")}-${Date.now()}`
    const countryCard = card.querySelector(".card")
    countryCard.dataset.countryId = countryId
    countryCard.dataset.countryName = country.name

    const bookmarkedCountries = JSON.parse(localStorage.getItem("bookmarkedCountries") || "[]")
    const isBookmarked = bookmarkedCountries.some((c) => c.name === country.name)

    if (isBookmarked) {
      const bookmarkButton = card.querySelector(".bookmark-button")
      bookmarkButton.classList.add("active")
      bookmarkButton.querySelector("i").classList.add("active")
    }

    countryCards.appendChild(card)
  },

  formatPopulation(population) {
    if (typeof population !== "number") {
      return population
    }

    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)} million`
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}k`
    }
    return population.toString()
  },

  handleDelete(card) {
    card.remove()
    const countryId = card.dataset.countryId
    if (countryId) {
      const bookmarkedCountries = JSON.parse(localStorage.getItem("bookmarkedCountries") || "[]")
      const updatedBookmarks = bookmarkedCountries.filter((c) => c.countryId !== countryId)
      localStorage.setItem("bookmarkedCountries", JSON.stringify(updatedBookmarks))
    }
  },

  handleBookmark(card) {
    const countryId = card.dataset.countryId
    const nameWithFlag = card.querySelector(".card-title").textContent
    const nameParts = nameWithFlag.split(" ")
    const flag = nameParts.length > 1 && nameParts[0].length <= 4 ? nameParts[0] : ""
    const name = flag ? nameWithFlag.substring(flag.length).trim() : nameWithFlag
    const capital = card.querySelector(".capital").textContent
    const population = card.querySelector(".population").textContent
    const region = card.querySelector(".region").textContent
    const tags = Array.from(card.querySelectorAll(".tag")).map((tag) => tag.textContent)

    if (!countryId) return

    const bookmarkedCountries = JSON.parse(localStorage.getItem("bookmarkedCountries") || "[]")
    const bookmarkButton = card.querySelector(".bookmark-button")

    const bookmarkIndex = bookmarkedCountries.findIndex((c) => c.countryId === countryId)

    if (bookmarkIndex >= 0) {
      bookmarkedCountries.splice(bookmarkIndex, 1)
      bookmarkButton.classList.remove("active")
      bookmarkButton.querySelector("i").classList.remove("active")
    } else {
      bookmarkedCountries.push({
        countryId,
        name,
        flag,
        capital,
        population,
        region,
        tags,
      })
      bookmarkButton.classList.add("active")
      bookmarkButton.querySelector("i").classList.add("active")
    }

    localStorage.setItem("bookmarkedCountries", JSON.stringify(bookmarkedCountries))
  },
}
