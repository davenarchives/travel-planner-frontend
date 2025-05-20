
// Function to load all templates
export async function loadTemplates() {
  try {
    console.log('Templates are already loaded in the HTML');
    return Promise.resolve();
  } catch (error) {
    console.error('Error loading templates:', error);
    return Promise.reject(error);
  }
}

// Helper function to get template by ID and clone it
export function getTemplate(templateId) {
  const template = document.getElementById(templateId);
  if (template) {
    return document.importNode(template.content, true);
  }
  console.error(`Template not found: ${templateId}`);
  return document.createDocumentFragment();
}
