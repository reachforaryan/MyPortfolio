import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleWave = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 5000; // Number of particles

    // Generate initial positions
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50; // x
            positions[i * 3 + 1] = 0; // y (will be animated)
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
        }
        return positions;
    }, [count]);

    // Shader for the particles
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#008080') }, // Retro Teal
        uMouse: { value: new THREE.Vector2(0, 0) }
    }), []);

    useFrame((state) => {
        if (pointsRef.current) {
            const material = pointsRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.getElapsedTime();

            // Smooth mouse interaction
            const mouseX = (state.pointer.x * state.viewport.width) / 2;
            const mouseY = (state.pointer.y * state.viewport.height) / 2;

            // Lerp current mouse uniform to actual mouse position for smoothness
            material.uniforms.uMouse.value.lerp(new THREE.Vector2(mouseX, mouseY), 0.1);
        }
    });

    const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying float vDistance;
    
    void main() {
      vec3 pos = position;
      
      // Create a flowing wave effect
      float wave = sin(pos.x * 0.2 + uTime) * cos(pos.z * 0.2 + uTime) * 1.5;
      
      // Mouse interaction: repel particles
      float dist = distance(pos.xz, uMouse);
      float repulsion = max(0.0, 5.0 - dist); // 5.0 is the radius of influence
      
      pos.y = wave + repulsion * 2.0;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size attenuation
      gl_PointSize = (4.0 / -mvPosition.z) * 10.0;
      
      vDistance = repulsion; // Pass repulsion strength to fragment shader
    }
  `;

    const fragmentShader = `
    uniform vec3 uColor;
    varying float vDistance;
    
    void main() {
      // Circular particle
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - strength;
      strength = pow(strength, 3.0);
      
      // Brighten color based on mouse interaction (vDistance)
      vec3 finalColor = uColor + vec3(vDistance * 0.2);
      
      gl_FragColor = vec4(finalColor, strength);
    }
  `;

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <shaderMaterial
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </points>
    );
};

export const RetroBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 -z-0 bg-retro-black">
            <Canvas camera={{ position: [0, 10, 20], fov: 45 }}>
                <ParticleWave />
            </Canvas>
        </div>
    );
};
