import React, { useRef, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

extend({ RoundedBoxGeometry });

// ==========================================
// 🛠️ ADJUSTABLE PARAMETERS (Fine-tuning)
// ==========================================

// Grid Density
const PARTICLE_COUNT_VERTICAL = 25;
const PARTICLE_COUNT_HORIZONTAL = 25;
const TOTAL_PARTICLES = PARTICLE_COUNT_VERTICAL * PARTICLE_COUNT_HORIZONTAL;
const PARTICLE_SPREAD = 95; // Controls the spread from the centre to outwards

// Fading Control (These will modulate with speed)
const OUTER_FADE_LIMIT_RADIUS = 30;
const OUTER_FADE_START_RADIUS = 6;
const INNER_VOID_LIMIT_RADIUS = 1;
const INNER_SOLID_START_RADIUS = 5;

// Local Physics/Motion (Per-particle soil interaction)
const MOUSE_SHRINK_RADIUS = 26;
const MOUSE_SHOVE_STRENGTH = 0.17;     // Shove particles out to form a rim
const MOUSE_MOMENTUM_CATCH = 0.97;      // 0 to 1: How much mouse speed is transferred to particles
const MOUSE_TRACKING_SMOOTHING = 0.04;
const ELASTIC_RESTORE_SPEED = 0.07;   // Lower = more glide/floaty return
const FLUID_VISCOSITY_FRICTION = 0.45; // Grittier, heavier feel (high friction)

// Visual Styling (Size & Color)
const PARTICLE_WIDTH = 0.45; // Replaces radius (2x previous radius of 0.16)
const PARTICLE_LENGTH = 0.85;
const PARTICLE_CORNER_RADIUS = 0.65; // New parameter for corner rounding
const PARTICLE_COLOR = "#4488ff";
const PARTICLE_EMISSIVE = "#727272";
const PARTICLE_EMISSIVE_INTENSITY = 0.8;

// Water Balloon Deformity (Interaction area)
const BALLOON_SQUISH_INTENSITY = 0.75; // How much the ball flattens with speed

// Global System Follow (Group drift)
const SYSTEM_FOLLOW_SMOOTHING = 0.009;

// Grass Wind Sway
const SWAY_STRENGTH = 0.9;
const SWAY_FREQUENCY = 0.8;

// Boundary Shape Adjustment
const BOUNDARY_ROUGHNESS = 5.0; // Controls the frequency/waviness of the outer edge

// ==========================================

const ParticleSystem = () => {
    const { viewport } = useThree();
    const instancedMeshRef = useRef();
    const systemGroupRef = useRef();

    // Persistent physics state
    const systemPosition = useRef(new THREE.Vector2(0, 0));
    const prevMousePos = useRef(new THREE.Vector2(0, 0));
    const mouseVelocityVec = useRef(new THREE.Vector2(0, 0));
    const mouseSpeed = useRef(0);
    const lerpedMouse = useRef(new THREE.Vector2(0, 0));

    const transformHelper = useMemo(() => new THREE.Object3D(), []);

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
                velocityX: 0, velocityY: 0, velocityZ: 0
            });
        }
        return data;
    }, []);

    useFrame((state) => {
        if (!instancedMeshRef.current || !systemGroupRef.current) return;

        const elapsedTime = state.clock.elapsedTime;

        // 1. Mouse Input & Precision Velocity Tuning
        const targetMouseX = (state.pointer.x * viewport.width) / 2;
        const targetMouseY = (state.pointer.y * viewport.height) / 2;

        const mdx = targetMouseX - prevMousePos.current.x;
        const mdy = targetMouseY - prevMousePos.current.y;

        // Update mouse trajectory components
        mouseVelocityVec.current.lerp(new THREE.Vector2(mdx, mdy), 0.2);
        mouseSpeed.current += (mouseVelocityVec.current.length() - mouseSpeed.current) * 0.1;
        prevMousePos.current.set(targetMouseX, targetMouseY);

        // 2. Dynamic Follow & Global Drift
        const speedFactor = Math.min(mouseSpeed.current * 0.5, 5.0);
        const dynamicSmoothing = SYSTEM_FOLLOW_SMOOTHING + speedFactor * 0.02;
        systemPosition.current.x += (targetMouseX - systemPosition.current.x) * dynamicSmoothing;
        systemPosition.current.y += (targetMouseY - systemPosition.current.y) * dynamicSmoothing;
        systemGroupRef.current.position.set(systemPosition.current.x, systemPosition.current.y, 0);

        // 3. Deformable Interaction Zone (The "Balloon")
        lerpedMouse.current.x += (targetMouseX - lerpedMouse.current.x) * MOUSE_TRACKING_SMOOTHING;
        lerpedMouse.current.y += (targetMouseY - lerpedMouse.current.y) * MOUSE_TRACKING_SMOOTHING;

        const localMouseX = lerpedMouse.current.x - systemPosition.current.x;
        const localMouseY = lerpedMouse.current.y - systemPosition.current.y;

        // Interaction Oval orientation based on mouse direction
        const interactionAngle = Math.atan2(mouseVelocityVec.current.y, mouseVelocityVec.current.x);
        const squish = 1 + mouseSpeed.current * BALLOON_SQUISH_INTENSITY;
        const cosIA = Math.cos(-interactionAngle);
        const sinIA = Math.sin(-interactionAngle);

        particleData.forEach((particle, index) => {
            // 4. Wind-grass Sway Logic
            const swayPhase = (particle.homeX * 0.2) + (particle.homeY * 0.2);
            const windSwayX = Math.sin(elapsedTime * SWAY_FREQUENCY + swayPhase) * SWAY_STRENGTH;
            const windSwayY = Math.cos(elapsedTime * SWAY_FREQUENCY * 0.8 + swayPhase) * (SWAY_STRENGTH * 0.5);
            const swayTilt = Math.sin(elapsedTime * SWAY_FREQUENCY + swayPhase) * 0.2;

            // 5. Normal Floating Motion
            const waterFloatX = Math.sin(elapsedTime * 0.5 + particle.homeX * 0.1) * 0.2;
            const waterFloatY = Math.cos(elapsedTime * 0.4 + particle.homeY * 0.1) * 0.2;

            const targetX = particle.homeX + waterFloatX + windSwayX;
            const targetY = particle.homeY + waterFloatY + windSwayY;

            // 6. Water Balloon on Soil (Shove & Drag)
            const rx = particle.x - localMouseX;
            const ry = particle.y - localMouseY;

            // Map distance to the squishy interaction oval
            const tx = (rx * cosIA - ry * sinIA) / squish;
            const ty = (rx * sinIA + ry * cosIA);
            const distInOval = Math.sqrt(tx * tx + ty * ty);

            const noise = Math.sin(elapsedTime * 2 + particle.homeX * 0.5) * 0.5;
            const balloonRadius = MOUSE_SHRINK_RADIUS + noise * 2.0;

            let mouseScaleFactor = 1.0;

            if (distInOval < balloonRadius) {
                const normalizedDist = distInOval / balloonRadius;

                // A. THE SHOVE: Push particles OUT to create a soil rim
                const shoveForce = (1 - normalizedDist) * MOUSE_SHOVE_STRENGTH;
                particle.velocityX += rx * shoveForce * 0.5;
                particle.velocityY += ry * shoveForce * 0.5;

                // B. THE MOMENTUM: Particles "catch" and carry mouse velocity
                const catchFactor = (1 - normalizedDist) * MOUSE_MOMENTUM_CATCH;
                particle.velocityX += mouseVelocityVec.current.x * catchFactor;
                particle.velocityY += mouseVelocityVec.current.y * catchFactor;

                // C. THE SHRINK: Visual squeeze inside the ball
                mouseScaleFactor = Math.pow(normalizedDist, 1.5);
            }

            // 7. Elastic Return Force (Firm Soil Snap)
            particle.velocityX += (targetX - particle.x) * ELASTIC_RESTORE_SPEED;
            particle.velocityY += (targetY - particle.y) * ELASTIC_RESTORE_SPEED;
            particle.velocityZ += (0 - particle.z) * ELASTIC_RESTORE_SPEED;

            // 8. Soil Friction (Heavy viscous drag)
            const currentFriction = Math.min(FLUID_VISCOSITY_FRICTION + speedFactor * 0.05, 0.95);
            particle.velocityX *= currentFriction;
            particle.velocityY *= currentFriction;
            particle.velocityZ *= currentFriction;

            // 9. Apply Movement
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.z += particle.velocityZ;

            // 10. Visual Alignment & Scaling
            const angleRC = Math.atan2(particle.y, particle.x);
            const distPath = Math.sqrt(particle.homeX ** 2 + particle.homeY ** 2);

            const boundaryWobble = (Math.sin(angleRC * BOUNDARY_ROUGHNESS + elapsedTime * 0.5) * 1.5 +
                Math.cos(angleRC * (BOUNDARY_ROUGHNESS - 1.0) - elapsedTime * 0.3) * 1.0) * (1 + speedFactor * 0.5);

            const oStart = OUTER_FADE_START_RADIUS + boundaryWobble;
            const oLimit = OUTER_FADE_LIMIT_RADIUS + boundaryWobble + speedFactor * 2;
            const iStart = INNER_SOLID_START_RADIUS + boundaryWobble * 0.5;
            const iVoid = INNER_VOID_LIMIT_RADIUS + boundaryWobble * 0.5;

            let visualScale = 1.0;
            if (distPath > oStart) visualScale *= Math.max(0, 1 - (distPath - oStart) / (oLimit - oStart));
            if (distPath < iStart) visualScale *= Math.max(0, (distPath - iVoid) / (iStart - iVoid));
            visualScale *= mouseScaleFactor;

            // 11. Update Instance Matrix
            transformHelper.position.set(particle.x, particle.y, particle.z);
            transformHelper.rotation.set(0, 0, angleRC + Math.PI / 2 + swayTilt);
            transformHelper.scale.set(visualScale, visualScale, visualScale);
            transformHelper.updateMatrix();
            instancedMeshRef.current.setMatrixAt(index, transformHelper.matrix);
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
