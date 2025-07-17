
export class AdminConfig {
  constructor(config = {}) {
    this.config = config;
    this.defaultConfig = {
      2: ['ABOUT_ME', 'ADDRESS'], 
      3: ['BIRTHDATE']
    };
  }

  // Get components for a specific page
  getComponentsForPage(pageNumber) {
    return this.config[pageNumber] || this.defaultConfig[pageNumber] || [];
  }

  // Get all available component types
  getAvailableComponents() {
    return ['ABOUT_ME', 'ADDRESS', 'BIRTHDATE'];
  }

  // Check if a component is enabled for a page
  isComponentEnabledForPage(componentType, pageNumber) {
    const components = this.getComponentsForPage(pageNumber);
    return components.includes(componentType);
  }

  // Get total number of configured pages
  getTotalPages() {
    const configuredPages = Object.keys(this.config).map(Number);
    const defaultPages = Object.keys(this.defaultConfig).map(Number);
    const allPages = [...new Set([...configuredPages, ...defaultPages])];
    return Math.max(...allPages);
  }

  // Validate configuration
  isValid() {
    try {
      const availableComponents = this.getAvailableComponents();
      
      for (const [page, components] of Object.entries(this.config)) {
        if (!Array.isArray(components)) return false;
        
        for (const component of components) {
          if (!availableComponents.includes(component)) return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Reset to default configuration
  resetToDefault() {
    this.config = { ...this.defaultConfig };
  }

  // Get configuration in API format
  toAPIFormat() {
    return this.config;
  }
}