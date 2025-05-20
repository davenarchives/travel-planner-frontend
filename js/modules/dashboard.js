
import { loadModule } from '../app.js';
import { getTemplate } from '../utils/templatesUtil.js';

export const dashboardModule = {
  // Initialize the dashboard module
  init(container) {
    // Create the dashboard view
    const template = getTemplate('dashboard-template');
    container.appendChild(template);
    
    // Load module data
    this.loadDashboardData();
  },
  
  // Load dashboard data
  loadDashboardData() {
    const moduleGrid = document.querySelector('.module-grid');
    if (!moduleGrid) return;
    
    const modules = [
      {
        id: 'weather',
        title: 'Weather Tracking',
        type: 'weather',
        description: 'Monitor weather conditions for your favorite destinations.',
        icon: 'fa-cloud',
        count: 3
      },
      {
        id: 'country',
        title: 'Country Explorer',
        type: 'country',
        description: 'Save and compare details about countries you plan to visit.',
        icon: 'fa-flag',
        count: 3
      },
      {
        id: 'currency',
        title: 'Currency Conversion',
        type: 'currency',
        description: 'Track exchange rates for your travel destinations.',
        icon: 'fa-money-bill',
        count: 3
      },
      {
        id: 'news',
        title: 'Travel News',
        type: 'news',
        description: 'Stay updated with the latest travel news and alerts.',
        icon: 'fa-newspaper',
        count: 3
      },
      {
        id: 'flight',
        title: 'Flight Search',
        type: 'flight',
        description: 'Find and save flight options for your upcoming trips.',
        icon: 'fa-plane',
        count: 3
      }
    ];
    
    modules.forEach(module => {
      this.createModuleCard(moduleGrid, module);
    });
  },
  
  // Create a module card
  createModuleCard(container, module) {
    const template = getTemplate('module-card-template');
    const card = template.querySelector('.module-card');
    
    card.dataset.moduleType = module.id;
    
    const title = card.querySelector('.module-card-title');
    title.textContent = module.title;
    
    const content = card.querySelector('.module-card-content');
    content.innerHTML = `
      <div class="module-icon ${module.id}-icon">
        <i class="fas ${module.icon}"></i>
      </div>
      <p class="module-description">${module.description}</p>
      <div class="module-count">${module.count} saved items</div>
    `;
    
    container.appendChild(card);
  }
};
