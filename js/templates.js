
// Function to load all templates
export async function loadTemplates() {
  try {
    // Load all template HTML files
    const dashboardTemplate = await fetchTemplate('dashboard');
    const weatherTemplate = await fetchTemplate('weather');
    const countryTemplate = await fetchTemplate('country');
    const currencyTemplate = await fetchTemplate('currency');
    const newsTemplate = await fetchTemplate('news');
    const flightTemplate = await fetchTemplate('flight');
    
    // Load all card templates
    const weatherCardTemplate = await fetchTemplate('cards/weather-card');
    const countryCardTemplate = await fetchTemplate('cards/country-card');
    const currencyCardTemplate = await fetchTemplate('cards/currency-card');
    const newsCardTemplate = await fetchTemplate('cards/news-card');
    const flightCardTemplate = await fetchTemplate('cards/flight-card');
    const moduleCardTemplate = await fetchTemplate('cards/module-card');
    
    // Create template elements and add to body (hidden)
    createTemplateElement('dashboard-template', dashboardTemplate);
    createTemplateElement('weather-template', weatherTemplate);
    createTemplateElement('country-template', countryTemplate);
    createTemplateElement('currency-template', currencyTemplate);
    createTemplateElement('news-template', newsTemplate);
    createTemplateElement('flight-template', flightTemplate);
    
    createTemplateElement('weather-card-template', weatherCardTemplate);
    createTemplateElement('country-card-template', countryCardTemplate);
    createTemplateElement('currency-card-template', currencyCardTemplate);
    createTemplateElement('news-card-template', newsCardTemplate);
    createTemplateElement('flight-card-template', flightCardTemplate);
    createTemplateElement('module-card-template', moduleCardTemplate);
    
    console.log('All templates loaded successfully');
  } catch (error) {
    console.error('Error loading templates:', error);
  }
}

// Fetch a template file
async function fetchTemplate(name) {
  const response = await fetch(`templates/${name}.html`);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${name}`);
  }
  return await response.text();
}

// Create a template element and add it to the body
function createTemplateElement(id, html) {
  const template = document.createElement('template');
  template.id = id;
  template.innerHTML = html;
  document.body.appendChild(template);
  return template;
}

// Helper function to get template by ID and clone it
export function getTemplate(templateId) {
  const template = document.getElementById(templateId);
  if (template) {
    return template.content.cloneNode(true);
  }
  console.error(`Template not found: ${templateId}`);
  return document.createDocumentFragment();
}
