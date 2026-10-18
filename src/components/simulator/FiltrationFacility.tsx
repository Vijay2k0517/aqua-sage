'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { useSimulation } from '@/lib/simulator/SimulationContext';
import { useSelection } from './interaction/SelectionProvider';
import { InteractiveWrapper } from './interaction/InteractiveWrapper';
import { Filter } from 'lucide-react';

/**
 * Compact Prototype Filtration Unit
 *
 * Represents the simulated / planned filtration assembly:
 * - Stage 1: Dual-media particulate & sand filter canister
 * - Stage 2: Membrane / activated carbon polishing canister
 * - Clearly marked as [SIMULATED - Planned Hardware]
 * - Activates when contamination is detected or diversion is triggered
 */
export function FiltrationFacility() {
  const { state } = useSimulation();
  const { selectedComponentId, selectComponent } = useSelection();

  const pipeRadius = 0.016;
  const canisterRadius = 0.09;
  const canisterHeight = 0.42;

  const isDiverting = state.filtrationState !== 'IDLE' || state.network.valves['valve-v-div']?.actualState === 'OPEN';
  const isSelected = selectedComponentId === 'flt-stage1';

  return (
    <group name="FiltrationUnit" position={[0.86, 0, -0.32]}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. SUPPORT BASE & COMPACT SKID FOOTPRINT                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <mesh position={[0.08, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.42, 0.04, 0.28]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Mounting Pedestals */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.10, 0.11, 0.04, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>
      <mesh position={[0.18, 0.06, 0]}>
        <cylinderGeometry args={[0.10, 0.11, 0.04, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. STAGE 1: PARTICULATE & SAND MEDIA CANISTER                */}
      {/* ──────────────────────────────────────────────────────────── */}
      <InteractiveWrapper id="flt-stage1" position={[0, 0.30, 0]} indicatorRadius={0.16}>
        <group>
          {/* Cylindrical Media Vessel */}
          <mesh castShadow>
            <cylinderGeometry args={[canisterRadius, canisterRadius, canisterHeight, 24]} />
            <meshStandardMaterial
              color={isSelected ? '#0284C7' : isDiverting ? '#0369A1' : '#1E293B'}
              metalness={0.7}
              roughness={0.25}
              emissive={isDiverting ? '#0284C7' : '#000000'}
              emissiveIntensity={isDiverting ? 0.3 : 0}
            />
          </mesh>

          {/* Dished Top Cap */}
          <mesh position={[0, canisterHeight / 2, 0]}>
            <sphereGeometry args={[canisterRadius, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Transparent Sight Inspection Port */}
          <mesh position={[0, 0, canisterRadius]}>
            <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
            <meshStandardMaterial
              color={isDiverting ? '#38BDF8' : '#64748B'}
              transparent
              opacity={0.7}
              roughness={0.1}
            />
          </mesh>

          {/* HUD Badge */}
          <Html position={[0, canisterHeight / 2 + 0.12, 0]} center distanceFactor={4.5}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                selectComponent('flt-stage1');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-md flex items-center gap-1.5 transition-all shadow-lg select-none cursor-pointer ${
                isDiverting
                  ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 animate-pulse font-bold'
                  : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Filtration Unit [Simulated Mechanism - Planned Hardware]"
            >
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>FILTRATION [{isDiverting ? 'ACTIVE' : 'STANDBY'}]</span>
            </button>
          </Html>
        </group>
      </InteractiveWrapper>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. STAGE 2: MEMBRANE / CARBON POLISHING CANISTER             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0.18, 0.30, 0]}>
        {/* Polishing Vessel */}
        <mesh castShadow>
          <cylinderGeometry args={[canisterRadius * 0.85, canisterRadius * 0.85, canisterHeight, 24]} />
          <meshStandardMaterial
            color={isDiverting ? '#047857' : '#1E293B'}
            metalness={0.7}
            roughness={0.25}
            emissive={isDiverting ? '#059669' : '#000000'}
            emissiveIntensity={isDiverting ? 0.3 : 0}
          />
        </mesh>

        {/* Dished Top Cap */}
        <mesh position={[0, canisterHeight / 2, 0]}>
          <sphereGeometry args={[canisterRadius * 0.85, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. INTER-STAGE TUBE & RETURN PIPING                          */}
      {/* ──────────────────────────────────────────────────────────── */}
      {/* Interconnecting U-Tube between Stage 1 and Stage 2 */}
      <mesh position={[0.09, 0.30 + canisterHeight / 2 + 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[pipeRadius * 0.8, pipeRadius * 0.8, 0.18, 12]} />
        <meshStandardMaterial color="#0284C7" metalness={0.8} />
      </mesh>

      {/* Return tube from Stage 2 back to tank return header */}
      <mesh position={[0.18, 0.30 + canisterHeight / 2 + 0.08, 0.08]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[pipeRadius * 0.8, pipeRadius * 0.8, 0.22, 12]} />
        <meshStandardMaterial
          color={isDiverting ? '#10B981' : '#475569'}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}
