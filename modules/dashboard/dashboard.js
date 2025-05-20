
import { getTemplate } from '../../js/templates.js';
import { loadModule } from '../../js/app.js';

export const dashboardModule = {
  init(container) {
    // Create the dashboard view
    const template = getTemplate('dashboard-template');
    container.appendChild(template);
    
    // Load module data
    this.loadDashboardData();
  },
  
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
    
    // Handle view button click
    const viewButton = card.querySelector('.view-button');
    if (viewButton) {
      viewButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click event from triggering
        loadModule(module.id);
      });
    }
    
    // Make the entire card clickable
    card.addEventListener('click', () => {
      loadModule(module.id);
    });
    
    // Add keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadModule(module.id);
      }
    });
    
    container.appendChild(card);
  }
};
