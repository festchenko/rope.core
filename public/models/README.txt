Digital Twin 3D Models
====================

This folder contains 3D models for the rope.core Digital Twin interface.

Required Files:
- yacht.glb - Main yacht 3D model (GLB format)

TODO: Replace with real yacht model
===============================

Currently using fallback geometry in YachtModel.tsx.
To use a real yacht model:

1. Place yacht.glb in this folder
2. The model should be:
   - GLB format (compressed GLTF)
   - Scaled appropriately (1 unit = 1 meter)
   - Centered at origin (0,0,0)
   - Optimized for web (under 5MB recommended)

3. Update hotspot coordinates in lib/systems.ts to match the real model

Model Requirements:
- Clean topology for good performance
- Reasonable polygon count for mobile devices
- Proper UV mapping for textures
- No unnecessary geometry or materials

Performance Notes:
- Use Draco compression for GLB files
- Consider LOD (Level of Detail) for complex models
- Test on mobile devices for frame rate
