import { create } from 'zustand';

export interface System {
  id: string;
  label: string;
  anchor: [number, number, number]; // [x, y, z] in world space
  status?: string;
  value?: string;
  icon?: string; // Icon name for the sensor
}

export interface UIState {
  // System orbit state
  activeSystem: string;
  rotationY: number; // radians
  systems: System[];
  
  // Actions
  setRotationY: (rotation: number) => void;
  setActiveSystem: (systemId: string) => void;
  snapToNearestSystem: () => void;
  rotateToSystem: (systemId: string) => void;
}

// Mock systems data with sensor metrics
const mockSystems: System[] = [
  {
    id: 'bilge',
    label: 'BILGE',
    anchor: [0.2, 0.1, 0],
    status: 'Normal',
    value: '0.2L',
    icon: '◉' // Water level - inspired by bilge pump icon
  },
  {
    id: 'battery',
    label: 'BATTERY',
    anchor: [0, -0.1, 0.2],
    status: 'Charging',
    value: '87%',
    icon: '▣' // Battery - inspired by battery icon
  },
  {
    id: 'smoke',
    label: 'SMOKE',
    anchor: [-0.2, 0.15, 0.1],
    status: 'Clear',
    value: '0 PPM',
    icon: '◐' // Smoke detector
  },
  {
    id: 'heat',
    label: 'HEAT',
    anchor: [0.1, 0.2, -0.1],
    status: 'Normal',
    value: '22°C',
    icon: '◈' // Heat sensor
  },
  {
    id: 'gps',
    label: 'GPS LOCATOR',
    anchor: [-0.1, 0.05, -0.2],
    status: 'Connected',
    value: '12 Sats',
    icon: '◊' // GPS satellite
  },
  {
    id: 'shore',
    label: 'SHORE POWER',
    anchor: [0.3, 0.05, 0.1],
    status: 'Connected',
    value: '240V',
    icon: '◘' // Power plug
  },
  {
    id: 'generator',
    label: 'IGNITION GENERATOR',
    anchor: [-0.3, 0.1, 0.05],
    status: 'Running',
    value: '1500 RPM',
    icon: '◙' // Engine/Generator
  },
  {
    id: 'temperature',
    label: 'TEMPERATURE',
    anchor: [0.15, 0.25, -0.15],
    status: 'Normal',
    value: '22°C',
    icon: '◈' // Temperature sensor
  },
  {
    id: 'humidity',
    label: 'HUMIDITY',
    anchor: [-0.15, 0.2, 0.15],
    status: 'Normal',
    value: '65%',
    icon: '◉' // Humidity sensor
  },
  {
    id: 'ac',
    label: 'AIR CONDITIONING',
    anchor: [0.25, 0.15, -0.25],
    status: 'Active',
    value: 'Auto',
    icon: '◐' // Air conditioning
  },
  {
    id: 'motion',
    label: 'MOTION',
    anchor: [-0.25, 0.3, 0.2],
    status: 'Clear',
    value: 'No Motion',
    icon: '◊' // Motion sensor
  },
  {
    id: 'hatch',
    label: 'HATCH',
    anchor: [0.1, 0.35, 0.05],
    status: 'Closed',
    value: 'Secure',
    icon: '◘' // Hatch door
  },
  {
    id: 'movement',
    label: 'MOVEMENT',
    anchor: [-0.1, 0.05, 0.3],
    status: 'Stable',
    value: '0.1°',
    icon: '◙' // Vibration/Movement sensor
  },
  {
    id: 'door',
    label: 'DOOR',
    anchor: [0.35, 0.1, -0.1],
    status: 'Locked',
    value: 'Secure',
    icon: '▣' // Door lock
  }
];

export const useUI = create<UIState>((set, get) => ({
  // Initial state
  activeSystem: 'bilge',
  rotationY: 0,
  systems: mockSystems,
  
  // Actions
  setRotationY: (rotation: number) => {
    set({ rotationY: rotation });
  },
  
  setActiveSystem: (systemId: string) => {
    set({ activeSystem: systemId });
  },
  
  snapToNearestSystem: () => {
    const { rotationY, systems } = get();
    const angleStep = (2 * Math.PI) / systems.length;
    const nearestIndex = Math.round(rotationY / angleStep);
    const snappedRotation = nearestIndex * angleStep;
    
    set({ 
      rotationY: snappedRotation,
      activeSystem: systems[nearestIndex % systems.length].id
    });
  },
  
  rotateToSystem: (systemId: string) => {
    const { systems } = get();
    const systemIndex = systems.findIndex(s => s.id === systemId);
    if (systemIndex !== -1) {
      const angleStep = (2 * Math.PI) / systems.length;
      const targetRotation = systemIndex * angleStep;
      set({ 
        rotationY: targetRotation,
        activeSystem: systemId
      });
    }
  }
}));
