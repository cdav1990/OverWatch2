import React, { useEffect, useRef, useMemo } from 'react';
import { useLoader, useThree, ThreeEvent } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';
import { LocalCoord } from '../../../types/mission';
import { feetToMeters } from '../../../utils/sensorCalculations';

interface DockModelProps {
  position?: LocalCoord | [number, number, number]; 
  rotation?: LocalCoord | [number, number, number];
  scale?: number | [number, number, number];
  // Optional prop to specify real-world dimensions
  realWorldLength?: number; // in feet
  heightOffset?: number; // Height offset in feet above ground plane (-50 to +50)
  // Add event handlers and userData
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onDoubleClick?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  userData?: any;
}

// Default dock dimensions (approximate)
const DEFAULT_DOCK_LENGTH_FEET = 500;
const DEFAULT_DOCK_WIDTH_FEET = 100;

const DockModel: React.FC<DockModelProps> = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 0.009, // Changed default scale to 0.009
  realWorldLength = DEFAULT_DOCK_LENGTH_FEET,
  heightOffset = -75, // Updated default to -75 feet for dock model
  onClick,
  onDoubleClick,
  onPointerOver,
  onPointerOut,
  userData
}) => {
  const modelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Format position properly for the primitive component
  const formattedPosition: [number, number, number] = Array.isArray(position) 
    ? position as [number, number, number]
    : [position.x, position.z, -position.y]; // Map local Z to THREE Y, negate local Y for THREE Z

  // Format rotation properly for the primitive component
  const formattedRotation: [number, number, number] = Array.isArray(rotation)
    ? rotation as [number, number, number]
    : [
        THREE.MathUtils.degToRad(rotation.x || 0),
        THREE.MathUtils.degToRad(rotation.z || 0), // Map local Z rot to THREE Y rot
        -THREE.MathUtils.degToRad(rotation.y || 0)  // Map local Y rot to THREE Z rot (negated)
      ];
  
  // Use the FBX loader to load the model
  const fbx = useLoader(
    FBXLoader, 
    '/models/3d-cargo-dockyard/source/3D Cargo Dockyard.fbx',
    (loader) => {
      // Set texture path to the textures directory
      loader.setPath('/models/3d-cargo-dockyard/textures/');
    }
  );
  
  // Use memo to avoid recreating the model on re-renders
  const model = useMemo(() => {
    if (!fbx) return null;
    
    // Create a copy of the loaded model
    const modelCopy = fbx.clone();
    
    // Process the model - optimize materials, add shadows, etc.
    modelCopy.traverse((node: any) => {
      if (node.isMesh) {
        // Enable shadows
        node.castShadow = true;
        node.receiveShadow = true;
        
        // Ensure materials are properly applied
        if (node.material) {
          // Set consistent material properties
          if (Array.isArray(node.material)) {
            node.material.forEach((mat: any) => {
              mat.side = THREE.DoubleSide;
              mat.needsUpdate = true;
            });
          } else {
            node.material.side = THREE.DoubleSide;
            node.material.needsUpdate = true;
          }
        }
      }
    });
    
    return modelCopy;
  }, [fbx]);
  
  // --- START: Material Fixing Logic ---
  useEffect(() => {
    const currentModel = modelRef.current;
    if (currentModel) {
      console.log(`[Material Check] Traversing dock model: ${currentModel.name || 'Unnamed'}`);
      currentModel.traverse((obj: any) => {
        if (obj.isMesh && obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          let materialsChanged = false; // Flag to check if we actually changed anything

          const updatedMaterials = materials.map((material: THREE.Material) => {
            // Check if the material instance itself has the type 'unknown'
            // or if its constructor name points to an issue (sometimes type isn't set correctly)
            if (material.type === 'unknown' || material.constructor.name === 'UnknownMaterial') {
              console.warn(`[Material Fix] Replacing unknown material on dock mesh "${obj.name}" with MeshStandardMaterial.`);
              materialsChanged = true;
              // Using MeshStandardMaterial might give better results with lighting/post-processing
              const fallbackMaterial = new THREE.MeshStandardMaterial({
                color: 0x999999, // Slightly lighter gray
                metalness: 0.1,
                roughness: 0.8,
                side: THREE.DoubleSide, // Keep double side if needed
                name: 'FallbackMaterial' // Give it a name for debugging
              });
              // Dispose of the old material if possible (helps with memory)
              material.dispose();
              return fallbackMaterial;
            }
            return material; // Keep the original material if it's known
          });

          // Only update the material property if changes were made
          if (materialsChanged) {
            if (Array.isArray(obj.material)) {
              obj.material = updatedMaterials;
            } else {
              obj.material = updatedMaterials[0];
            }
            // Important: Tell Three.js the material needs an update
            // Check if obj.material is an array or single object before accessing needsUpdate
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m: THREE.Material) => { if (m) m.needsUpdate = true; });
            } else if (obj.material) {
              obj.material.needsUpdate = true;
            }
          }
        }
      });
    }
  }, [model]); // Re-run this effect when the 'model' object changes (i.e., after loading)
  // --- END: Material Fixing Logic ---
  
  // Calculate model dimensions and appropriate scale
  const [modelDimensions, calculatedScale] = useMemo(() => {
    if (!model) return [null, null];
    
    // Create a bounding box to measure the model
    const bbox = new THREE.Box3().setFromObject(model);
    const size = bbox.getSize(new THREE.Vector3());
    
    // Log the raw model dimensions
    console.log('Raw dock model dimensions (model units):', {
      width: size.x,
      height: size.y,
      length: size.z
    });
    
    // Convert realWorldLength from feet to meters (our scene units)
    const targetLengthMeters = feetToMeters(realWorldLength);
    
    // Calculate scaling factor needed to achieve the target length
    // We use the maximum dimension as the model's "length"
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = targetLengthMeters / maxDimension;
    
    console.log(`Scaling dock model to match ${realWorldLength} feet (${targetLengthMeters.toFixed(2)} meters)`);
    console.log(`Calculated scale factor: ${scaleFactor}`);
    
    return [size, scaleFactor];
  }, [model, realWorldLength]);
  
  // Add early detection of manual scaling for use in useEffect
  const scaleValue = typeof scale === 'number' ? scale : 1;
  const isLargeScale = scaleValue > 2;

  // Convert height offset from feet to meters
  const heightOffsetMeters = feetToMeters(heightOffset);

  // Apply any necessary transformations after the model loads
  useEffect(() => {
    if (modelRef.current && model && modelDimensions) {
      // Calculate the bounding box to get proper dimensions and center
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // MODIFIED: Apply ground anchoring only if heightOffset is 0
      // Otherwise, position the model at the specified height above/below ground
      if (heightOffset === 0) {
        // Ground the model
        modelRef.current.position.y -= (box.min.y - formattedPosition[1]);
      } else {
        // Position model at the specified height
        // First ground it, then add the height offset
        modelRef.current.position.y -= (box.min.y - formattedPosition[1]);
        modelRef.current.position.y += heightOffsetMeters;
      }
      
      // 2. Center the model on its X and Z axes for better stability when scaling
      // The 0.5 multiplier prevents overcompensation
      // Only apply for large scales to preserve exact positioning
      if (isLargeScale) {
        // Only apply aggressive centering for large scale values
        modelRef.current.position.x -= (center.x - formattedPosition[0]) * 0.5;
        modelRef.current.position.z -= (center.z - formattedPosition[2]) * 0.5;
      }
      
      console.log('Dock model loaded with dimensions (after scaling):', {
        width: modelDimensions.x * (calculatedScale || 1),
        height: modelDimensions.y * (calculatedScale || 1),
        length: modelDimensions.z * (calculatedScale || 1),
        units: 'meters',
        heightOffset: heightOffsetMeters,
        boundingBox: {
          min: { x: box.min.x, y: box.min.y, z: box.min.z },
          max: { x: box.max.x, y: box.max.y, z: box.max.z }
        }
      });
    }
  }, [model, modelDimensions, calculatedScale, formattedPosition, isLargeScale, heightOffsetMeters]);
  
  // Return null if model hasn't loaded yet
  if (!model) return null;
  
  // Determine the final scale to apply with more predictable behavior
  let finalScale: [number, number, number];

  // IMPROVED: Create a more intuitive scaling experience with better defaults for the dock model
  // Default scale factor for different scale value ranges
  const getCustomNormalization = (scaleValue: number): number => {
    // Special case handling: the "sweet spot" range for this specific dock model
    if (scaleValue >= 0.05 && scaleValue <= 0.2) {
      // Use direct values in the sweet spot range - no normalization needed
      return 1.0; 
    } else if (scaleValue < 0.05) {
      // Very small values - use smaller normalization
      return 0.2;
    } else if (scaleValue <= 1) {
      // Medium values - use medium normalization
      return 0.1;
    } else {
      // Large values - use smallest normalization for gradual scaling
      return 0.03;
    }
  };

  // IMPROVED: More intuitive manual scaling detection with proper type checking
  const isManualScaling = typeof scale === 'number' 
    ? (scale !== 1.0) // Any non-default scale is considered manual
    : Array.isArray(scale) 
      ? (scale as number[]).some(val => val !== 1.0)
      : false;

  // Detailed logging for debugging
  console.log(`DockModel scale check: scale=${typeof scale === 'number' ? scale : JSON.stringify(scale)}, isManualScaling=${isManualScaling}`);

  if (calculatedScale !== null && !isManualScaling) {
    // If using the calculated real-world scale
    const scaleValue = calculatedScale || 1.0; // Default to 1.0 if null
    finalScale = [
      scaleValue,
      scaleValue,
      scaleValue
    ];
    console.log('Using calculated scale with realWorldLength:', finalScale);
  } else {
    // For manual scaling, apply adaptive normalization based on scale range
    // This makes the scaling behavior more intuitive across different ranges
    if (typeof scale === 'number') {
      // Handle single number scale
      const normFactor = getCustomNormalization(scale);
      const effectiveScale = scale * normFactor;
      
      // If we're in the sweet spot range, use exact values
      finalScale = [effectiveScale, effectiveScale, effectiveScale];
    } else if (Array.isArray(scale)) {
      // Handle array scale with proper type safety
      const scaleArray = scale as number[];
      finalScale = [
        scaleArray[0] * getCustomNormalization(scaleArray[0]),
        scaleArray[1] * getCustomNormalization(scaleArray[1]),
        scaleArray[2] * getCustomNormalization(scaleArray[2])
      ];
    } else {
      // Fallback for any other case
      finalScale = [1, 1, 1];
    }
    
    console.log('Using normalized manual scale:', finalScale, 'from original:', scale);
  }
  
  return (
    <primitive
      ref={modelRef}
      object={model}
      position={formattedPosition}
      rotation={formattedRotation}
      scale={finalScale}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      userData={userData}
    />
  );
};

// Preload the model for better performance
useLoader.preload(FBXLoader, '/models/3d-cargo-dockyard/source/3D Cargo Dockyard.fbx');

export default DockModel; 