import React, { useRef, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

extend({ RoundedBoxGeometry });

// ==========================================
// 🛠️ ADJUSTABLE PARAMETERS (Fine-tuning)
// ==========================================

// Grid Density
const PARTICLE_COUNT_VERTICAL = 50; // User set 45
const PARTICLE_COUNT_HORIZONTAL = 50; // User set 45
const TOTAL_PARTICLES = PARTICLE_COUNT_VERTICAL * PARTICLE_COUNT_HORIZONTAL;
const PARTICLE_SPREAD = 150;

// Visibility (The "Flashlight" Effect)
const CURSOR_VISIBLE_RADIUS = 10; // User set 18
const CURSOR_FADE_EDGE = 18;      // User set 10

// Roughness of the Visibility Circle
const CIRCUMFERENCE_ROUGHNESS = 3;  // Base Amplitude for noise
const CIRCUMFERENCE_FREQUENCY = 1;  // Base Frequency
const CIRCUMFERENCE_SPEED = 1;      // Animation speed of roughness

// Local Physics/Motion (Per-particle soil interaction)
const MOUSE_SHRINK_RADIUS = 20;       // User set 25
const MOUSE_SHOVE_STRENGTH = 0.01;    // User set 0.04
const MOUSE_MOMENTUM_CATCH = 0.15;    // User set 0.25
const MOUSE_TRACKING_SMOOTHING = 0.025; // User set 0.025
const ELASTIC_RESTORE_SPEED = 0.015;  // User set 0.015
const FLUID_VISCOSITY_FRICTION = 0.50;// User set 0.80

// Tidal Wave Effect (Beach waves)
const TIDE_STRENGTH = 0.005;      // User set 0.005
const TIDE_SPEED = 2.0;          // User set 1.0
const TIDE_FREQUENCY = 0.4;      // User set 0.4

// Visual Styling (Size & Color)
const PARTICLE_WIDTH = 0.65;   // User set 0.65
const PARTICLE_LENGTH = 0.35; // User set 0.35
const PARTICLE_CORNER_RADIUS = 0.65;
const PARTICLE_COLOR = "#c0c0c0ff";
const PARTICLE_EMISSIVE = "#727272";
const PARTICLE_EMISSIVE_INTENSITY = 0.75; // User set 0.35

// Water Balloon Deformity (Interaction area)
const BALLOON_SQUISH_INTENSITY = 0.15; // User set 0.45

// Grass Wind Sway
const SWAY_STRENGTH = 0.4; // User set 0.4
const SWAY_FREQUENCY = 0.2; // User set 0.2

// Random Loose Drift
const DRIFT_SPEED = 0.2; // User set 0.1
const DRIFT_RANGE = 0.5; // User set 0.25

// ==========================================

const ParticleSystem = () => {
    const { viewport } = useThree();
    const instancedMeshRef = useRef();
    const systemGroupRef = useRef();

    // Persistent physics state
    const prevMousePos = useRef(new THREE.Vector2(0, 0));
    const mouseVelocityVec = useRef(new THREE.Vector2(0, 0));
    const mouseSpeed = useRef(0);
    const lerpedMouse = useRef(new THREE.Vector2(0, 0));

    const transformHelper = useMemo(() => new THREE.Object3D(), []);

    // Random offsets for drift
    const particleData = useMemo(() => {
        const data = [];
        for (let i = 0; i < TOTAL_PARTICLES; i++) {
            const rowIndex = Math.floor(i / PARTICLE_COUNT_HORIZONTAL);
            const colIndex = i % PARTICLE_COUNT_HORIZONTAL;
            const initialX = (colIndex / (PARTICLE_COUNT_HORIZONTAL - 1) - 0.5) * PARTICLE_SPREAD;
            const initialY = (rowIndex / (PARTICLE_COUNT_VERTICAL - 1) - 0.5) * PARTICLE_SPREAD;
            data.push({
                x: initialX, y: initialY, z: 0,
                homeX: initialX, homeY: initialY, homeZ: 0,
                velocityX: 0, velocityY: 0, velocityZ: 0,
                driftPhase: Math.random() * Math.PI * 2,
            });
        }
        return data;
    }, []);

    useFrame((state) => {
        if (!instancedMeshRef.current || !systemGroupRef.current) return;

        const elapsedTime = state.clock.elapsedTime;

        // 1. Mouse Input 
        const targetMouseX = (state.pointer.x * viewport.width) / 2;
        const targetMouseY = (state.pointer.y * viewport.height) / 2;

        const mdx = targetMouseX - prevMousePos.current.x;
        const mdy = targetMouseY - prevMousePos.current.y;

        mouseVelocityVec.current.lerp(new THREE.Vector2(mdx, mdy), 0.2);
        mouseSpeed.current += (mouseVelocityVec.current.length() - mouseSpeed.current) * 0.1;
        prevMousePos.current.set(targetMouseX, targetMouseY);

        // 2. Local Mouse Smoothing
        lerpedMouse.current.x += (targetMouseX - lerpedMouse.current.x) * MOUSE_TRACKING_SMOOTHING;
        lerpedMouse.current.y += (targetMouseY - lerpedMouse.current.y) * MOUSE_TRACKING_SMOOTHING;

        const localMouseX = lerpedMouse.current.x;
        const localMouseY = lerpedMouse.current.y;

        // Squish Logic
        const interactionAngle = Math.atan2(mouseVelocityVec.current.y, mouseVelocityVec.current.x);
        const squish = 1 + mouseSpeed.current * BALLOON_SQUISH_INTENSITY;
        const cosIA = Math.cos(-interactionAngle);
        const sinIA = Math.sin(-interactionAngle);

        particleData.forEach((particle, index) => {
            // 3. Loose Random Drift + Sway
            const driftX = Math.sin(elapsedTime * DRIFT_SPEED + particle.driftPhase) * DRIFT_RANGE;
            const driftY = Math.cos(elapsedTime * DRIFT_SPEED * 0.8 + particle.driftPhase) * DRIFT_RANGE;

            const swayPhase = (particle.homeX * 0.2) + (particle.homeY * 0.2);
            const windSwayX = Math.sin(elapsedTime * SWAY_FREQUENCY + swayPhase) * SWAY_STRENGTH;
            const windSwayY = Math.cos(elapsedTime * SWAY_FREQUENCY * 0.8 + swayPhase) * (SWAY_STRENGTH * 0.5);

            const targetX = particle.homeX + driftX + windSwayX;
            const targetY = particle.homeY + driftY + windSwayY;

            // 4. Physics Interaction
            const rx = particle.x - localMouseX;
            const ry = particle.y - localMouseY;
            const distFromMouse = Math.sqrt(rx * rx + ry * ry);

            // Balloon Interaction Check
            const tx = (rx * cosIA - ry * sinIA) / squish;
            const ty = (rx * sinIA + ry * cosIA);
            const distInOval = Math.sqrt(tx * tx + ty * ty);

            const noise = Math.sin(elapsedTime * 2 + particle.homeX * 0.5) * 0.5;
            const balloonRadius = MOUSE_SHRINK_RADIUS + noise * 2.0;

            let mouseScaleFactor = 1.0;

            // TIDAL FORCE (Beach Wave)
            if (distFromMouse < CURSOR_VISIBLE_RADIUS + CURSOR_FADE_EDGE + CIRCUMFERENCE_ROUGHNESS) {
                const tidePhase = elapsedTime * TIDE_SPEED - distFromMouse * TIDE_FREQUENCY;
                const tideForce = Math.sin(tidePhase) * TIDE_STRENGTH;

                if (distFromMouse > 0.01) {
                    particle.velocityX += (rx / distFromMouse) * tideForce;
                    particle.velocityY += (ry / distFromMouse) * tideForce;
                }
            }

            if (distInOval < balloonRadius) {
                const normalizedDist = distInOval / balloonRadius;

                // A. THE SHOVE 
                const shoveForce = (1 - normalizedDist) * MOUSE_SHOVE_STRENGTH;
                particle.velocityX += rx * shoveForce * 0.5;
                particle.velocityY += ry * shoveForce * 0.5;

                // B. MOMENTUM
                const catchFactor = (1 - normalizedDist) * MOUSE_MOMENTUM_CATCH;
                particle.velocityX += mouseVelocityVec.current.x * catchFactor;
                particle.velocityY += mouseVelocityVec.current.y * catchFactor;

                // C. SHRINK
                mouseScaleFactor = Math.pow(normalizedDist, 1.5);
            }

            // 5. Elastic Return
            particle.velocityX += (targetX - particle.x) * ELASTIC_RESTORE_SPEED;
            particle.velocityY += (targetY - particle.y) * ELASTIC_RESTORE_SPEED;
            particle.velocityZ += (0 - particle.z) * ELASTIC_RESTORE_SPEED;

            // 6. Friction
            const currentFriction = Math.min(FLUID_VISCOSITY_FRICTION + Math.min(mouseSpeed.current * 0.05, 0.15), 0.95);
            particle.velocityX *= currentFriction;
            particle.velocityY *= currentFriction;
            particle.velocityZ *= currentFriction;

            // 7. Apply Movement
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.z += particle.velocityZ;

            // 8. Visibility (Irregular Rough Circumference - Layered Noise)
            let visualScale = 1.0;

            // Calculate effective radius based on angle using FBM (Fractal Brownian Motion / Layered Sinusoids)
            const angleFromMouse = Math.atan2(ry, rx);

            // Layer 1: Base low frequency
            const n1 = Math.sin(angleFromMouse * CIRCUMFERENCE_FREQUENCY + elapsedTime * CIRCUMFERENCE_SPEED);
            // Layer 2: Medium frequency
            const n2 = Math.sin(angleFromMouse * CIRCUMFERENCE_FREQUENCY * 2.5 - elapsedTime * CIRCUMFERENCE_SPEED * 1.5) * 0.5;
            // Layer 3: High frequency detail
            const n3 = Math.sin(angleFromMouse * CIRCUMFERENCE_FREQUENCY * 5.0 + elapsedTime * CIRCUMFERENCE_SPEED * 2.0) * 0.25;

            // Sum and scale
            const totalNoise = (n1 + n2 + n3) * CIRCUMFERENCE_ROUGHNESS;

            const effectiveRadius = CURSOR_VISIBLE_RADIUS + totalNoise;

            if (distFromMouse > effectiveRadius) {
                const fadeStart = effectiveRadius;
                const fadeEnd = effectiveRadius + CURSOR_FADE_EDGE;

                if (distFromMouse < fadeEnd) {
                    visualScale = 1 - (distFromMouse - fadeStart) / CURSOR_FADE_EDGE;
                } else {
                    visualScale = 0;
                }
            }
            visualScale *= mouseScaleFactor;
            visualScale = Math.max(0, visualScale);

            // 9. Update Matrix
            if (visualScale > 0.01) {
                transformHelper.position.set(particle.x, particle.y, particle.z);

                // MOUSE ALIGNMENT
                const angleToMouse = Math.atan2(localMouseY - particle.y, localMouseX - particle.x);
                transformHelper.rotation.set(0, 0, angleToMouse);

                transformHelper.scale.set(visualScale, visualScale, visualScale);
                transformHelper.updateMatrix();
                instancedMeshRef.current.setMatrixAt(index, transformHelper.matrix);
            } else {
                transformHelper.scale.set(0, 0, 0);
                transformHelper.updateMatrix();
                instancedMeshRef.current.setMatrixAt(index, transformHelper.matrix);
            }
        });

        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={systemGroupRef}>
            <instancedMesh ref={instancedMeshRef} args={[null, null, TOTAL_PARTICLES]}>
                <roundedBoxGeometry args={[PARTICLE_WIDTH, PARTICLE_LENGTH, PARTICLE_WIDTH, 4, PARTICLE_CORNER_RADIUS]} />
                <meshStandardMaterial
                    color={PARTICLE_COLOR}
                    emissive={PARTICLE_EMISSIVE}
                    emissiveIntensity={PARTICLE_EMISSIVE_INTENSITY}
                    roughness={0.3}
                    metalness={0.8}
                />
            </instancedMesh>
        </group>
    );
};

export default ParticleSystem;
