export const countryAPI = {
  laravelUrl: "http://localhost:8000",
  restCountriesUrl: "https://restcountries.com/v3.1",

  // Get info about a single country
  async getCountryInfo(countryName) {
    try {
      // First try Laravel backend
      console.log(`Trying Laravel backend for ${countryName}...`);
      const laravelResponse = await fetch(`${this.laravelUrl}/countries/${encodeURIComponent(countryName)}`);
      
      if (laravelResponse.ok) {
        console.log(`✅ Laravel backend responded for ${countryName}`);
        const data = await laravelResponse.json();
        return data;
      } else {
        throw new Error(`Laravel backend returned ${laravelResponse.status}`);
      }
    } catch (laravelError) {
      console.warn(`⚠️ Laravel backend failed for ${countryName}:`, laravelError.message);
      console.log(`🔄 Falling back to REST Countries API...`);
      
      try {
        // Fallback to REST Countries API
        const restResponse = await fetch(`${this.restCountriesUrl}/name/${encodeURIComponent(countryName)}`);
        
        if (!restResponse.ok) {
          throw new Error(`Country ${countryName} not found in REST Countries API`);
        }
        
        const restData = await restResponse.json();
        const country = restData[0]; // REST Countries returns an array
        
        console.log(`✅ REST Countries API responded for ${countryName}`);
        
        // Transform REST Countries data to match your Laravel format
        return {
          name: country.name.common,
          capital: country.capital ? country.capital[0] : "Unknown",
          population: country.population.toLocaleString(),
          region: country.region,
          flag: country.flag,
          tags: [
            country.subregion?.toLowerCase() || "country",
            country.continents?.[0]?.toLowerCase() || "continent",
            country.landlocked ? "landlocked" : "coastal"
          ].filter(Boolean)
        };
      } catch (restError) {
        console.error(`❌ Both Laravel and REST Countries failed for ${countryName}:`, restError);
        return null;
      }
    }
  }
}