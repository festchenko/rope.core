// Centralized theme configuration
export const theme = {
  colors: {
    // Base colors
    background: '#1a1d23',
    appBackground: '#0f1115', // Более темный фон для всего приложения
    foreground: '#ffffff',
    
    // Card colors
    card: '#374151',
    cardHover: '#4b5563',
    
    // Text colors
    muted: 'rgba(255, 255, 255, 0.6)',
    
    // Accent color
    accent: '#6b7280',
    accentGlow: 'rgba(107, 114, 128, 0.3)',
    
    // Border colors
    border: '#6b7280',
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // System colors
    system: {
      energy: '#6b7280',
      tanks: '#6b7280',
      security: '#6b7280',
      anchor: '#6b7280',
      environment: '#6b7280',
      alerts: '#6b7280',
    },
    
    // 3D Scene colors
    scene: {
      fog: '#1a1d23',
      ambientLight: '#ffffff',
      directionalLight: '#fff9e8',
      directionalLightSecondary: '#ffffff',
      hemisphereLight: '#ffffff',
    },
    
    // Loading colors
    loading: {
      background: '#1a1d23',
      spinner: '#6b7280',
    }
  },
  
  // CSS custom properties for runtime access
  cssVariables: {
    '--bg': '#1a1d23',
    '--app-bg': '#0f1115',
    '--fg': '#ffffff',
    '--card': '#374151',
    '--card-hover': '#4b5563',
    '--muted': 'rgba(255, 255, 255, 0.6)',
    '--accent': '#6b7280',
    '--accent-glow': 'rgba(107, 114, 128, 0.3)',
    '--border': '#6b7280',
    '--shadow': 'rgba(0, 0, 0, 0.1)',
  }
} as const;

export type Theme = typeof theme;
