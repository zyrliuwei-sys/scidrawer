'use client';

import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

/**
 * Rich scientific figure animation — used in the hero on the right column.
 *
 * The single 600×400 viewport hosts a composite research figure (the
 * kind that actually shows up in a Nature paper), with seven distinct
 * panels:
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │  Title bar + figure number + journal badge          │
 *   ├─────────────────────────────────────────────────────┤
 *   │  Pathway: Ligand → Receptor → Cascade (pulsing)    │
 *   ├──────────────────────┬──────────────────────────────┤
 *   │  Cell cross-section  │  Bar chart with error bars    │
 *   │  (organelles pulse)  │  (bars grow on mount)        │
 *   ├──────────────────────┴──────────────────────────────┤
 *   │  Volcano plot (scatter, animated points)            │
 *   ├─────────────────────────────────────────────────────┤
 *   │  Protein ribbon (rotating helices) + sparkline     │
 *   └─────────────────────────────────────────────────────┘
 *
 * Animations are pure CSS / motion path — no JS timers, no React
 * state. The component is a single static SVG that plays its loops
 * forever. Anything visible on the page is purely illustrative;
 * nothing here is asserted about real biology.
 */
export function ScientificAnimation({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 540"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-full w-full', className)}
      role="img"
      aria-label="Animated scientific research figure with multiple panels"
    >
      <defs>
        <linearGradient id="sa-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="sa-path" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="sa-nucleus" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="sa-mito" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <linearGradient id="sa-mem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="sa-bar-1" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="sa-bar-2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="sa-bar-3" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="sa-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <marker
          id="sa-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="800" height="540" fill="url(#sa-bg)" rx="12" />

      {/* ═══ Title bar ═══ */}
      <g>
        <rect x="0" y="0" width="800" height="32" fill="#0f172a" rx="12" />
        <rect x="0" y="24" width="800" height="8" fill="#0f172a" />
        <circle cx="16" cy="16" r="4" fill="#f87171" />
        <circle cx="30" cy="16" r="4" fill="#fbbf24" />
        <circle cx="44" cy="16" r="4" fill="#34d399" />
        <text
          x="400"
          y="20"
          fontSize="11"
          fontWeight="600"
          fill="#e2e8f0"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          Figure 1 · Multi-panel mechanism analysis
        </text>
        <rect x="720" y="9" width="68" height="14" rx="3" fill="#1e293b" />
        <text
          x="754"
          y="19"
          fontSize="8"
          fontWeight="700"
          fill="#22d3ee"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          J · Sci · 2026
        </text>
      </g>

      {/* ═══ Panel A: Pathway diagram ═══ */}
      <g transform="translate(0, 50)">
        <text
          x="24"
          y="0"
          fontSize="10"
          fontWeight="700"
          fill="#0f172a"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          A · Pathway
        </text>
        <text
          x="80"
          y="0"
          fontSize="8"
          fill="#64748b"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          Ligand → Receptor → Cascade
        </text>

        {/* Ligand (hexagon) */}
        <g transform="translate(60, 35)">
          <polygon
            points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6"
            fill="#fce7f3"
            stroke="#e11d48"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="3"
            fontSize="8"
            fontWeight="700"
            fill="#9f123d"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            EGF
          </text>
        </g>

        {/* Arrow ligand → receptor */}
        <line
          x1="76"
          y1="35"
          x2="130"
          y2="35"
          stroke="#94a3b8"
          strokeWidth="1.5"
          markerEnd="url(#sa-arrow)"
        />

        {/* Receptor (transmembrane) */}
        <g transform="translate(140, 14)">
          <rect width="14" height="42" rx="3" fill="#0ea5e9" opacity="0.9" />
          <rect
            x="14"
            width="14"
            height="42"
            rx="3"
            fill="#0369a1"
            opacity="0.9"
          />
          <text
            x="14"
            y="65"
            fontSize="8"
            fontWeight="600"
            fill="#475569"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            EGFR
          </text>
        </g>

        {/* Arrow receptor → cascade */}
        <line
          x1="172"
          y1="35"
          x2="226"
          y2="35"
          stroke="#94a3b8"
          strokeWidth="1.5"
          markerEnd="url(#sa-arrow)"
        />

        {/* Cascade nodes (3 mini boxes) */}
        {[
          { x: 232, label: 'Ras', fill: '#fef3c7', stroke: '#f59e0b' },
          { x: 280, label: 'Raf', fill: '#fef3c7', stroke: '#f59e0b' },
          { x: 328, label: 'MEK', fill: '#dcfce7', stroke: '#14b8a6' },
          { x: 376, label: 'ERK', fill: '#0ea5e9', stroke: '#0369a1' },
        ].map((node, i) => (
          <g key={node.label} transform={`translate(${node.x}, 20)`}>
            <rect
              width="36"
              height="30"
              rx="6"
              fill={node.fill}
              stroke={node.stroke}
              strokeWidth="1.5"
            />
            <text
              x="18"
              y="20"
              fontSize="9"
              fontWeight="700"
              fill={node.stroke === '#0ea5e9' ? '#fff' : '#92400e'}
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {node.label}
            </text>
            {/* pulse ring on the active kinase */}
            {i === 3 && (
              <rect
                x="-3"
                y="-3"
                width="42"
                height="36"
                rx="9"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="1.5"
                className="sa-pulse"
              />
            )}
          </g>
        ))}

        {/* Arrow cascade → nucleus */}
        <line
          x1="412"
          y1="35"
          x2="460"
          y2="35"
          stroke="url(#sa-path)"
          strokeWidth="2"
          strokeDasharray="6 4"
          className="sa-dash-flow"
          markerEnd="url(#sa-arrow)"
        />

        {/* Nucleus (ellipse with DNA strand inside) */}
        <g transform="translate(540, 35)">
          <ellipse
            cx="0"
            cy="0"
            rx="42"
            ry="22"
            fill="url(#sa-nucleus)"
            opacity="0.4"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="42"
            ry="22"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="1.5"
          />
          {/* DNA double-helix squiggle */}
          <path
            d="M -30 0 Q -20 -10 -10 0 T 10 0 T 30 0"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M -30 0 Q -20 10 -10 0 T 10 0 T 30 0"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* base pairs */}
          <line
            x1="-25"
            y1="-3"
            x2="-25"
            y2="3"
            stroke="#7c3aed"
            strokeWidth="1"
          />
          <line
            x1="-15"
            y1="-3"
            x2="-15"
            y2="3"
            stroke="#7c3aed"
            strokeWidth="1"
          />
          <line
            x1="-5"
            y1="-3"
            x2="-5"
            y2="3"
            stroke="#7c3aed"
            strokeWidth="1"
          />
          <line x1="5" y1="-3" x2="5" y2="3" stroke="#7c3aed" strokeWidth="1" />
          <line
            x1="15"
            y1="-3"
            x2="15"
            y2="3"
            stroke="#7c3aed"
            strokeWidth="1"
          />
          <line
            x1="25"
            y1="-3"
            x2="25"
            y2="3"
            stroke="#7c3aed"
            strokeWidth="1"
          />
          <text
            x="0"
            y="36"
            fontSize="8"
            fontWeight="600"
            fill="#5b21b6"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Nucleus
          </text>
        </g>

        {/* p-value annotation */}
        <g transform="translate(640, 24)">
          <rect
            width="80"
            height="22"
            rx="4"
            fill="#ecfdf5"
            stroke="#10b981"
            strokeWidth="1"
          />
          <text
            x="40"
            y="14"
            fontSize="9"
            fontWeight="700"
            fill="#047857"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            p = 0.003
          </text>
        </g>
        <g transform="translate(640, 50)">
          <rect
            width="80"
            height="22"
            rx="4"
            fill="#fef2f2"
            stroke="#f87171"
            strokeWidth="1"
          />
          <text
            x="40"
            y="14"
            fontSize="9"
            fontWeight="700"
            fill="#b91c1c"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            n = 24
          </text>
        </g>
      </g>

      {/* ═══ Divider ═══ */}
      <line
        x1="20"
        y1="160"
        x2="780"
        y2="160"
        stroke="#e2e8f0"
        strokeWidth="1"
      />

      {/* ═══ Panel B: Cell cross-section (left) ═══ */}
      <g transform="translate(0, 180)">
        <text
          x="24"
          y="0"
          fontSize="10"
          fontWeight="700"
          fill="#0f172a"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          B · Cell
        </text>
        <text
          x="64"
          y="0"
          fontSize="8"
          fill="#64748b"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          Cross-section (Eukarya)
        </text>

        {/* Cell membrane outline */}
        <g transform="translate(190, 70)">
          <ellipse
            cx="0"
            cy="0"
            rx="120"
            ry="60"
            fill="#fef9c3"
            fillOpacity="0.25"
            stroke="#92400e"
            strokeWidth="1.5"
          />

          {/* Nucleus */}
          <ellipse
            cx="-40"
            cy="-10"
            rx="28"
            ry="20"
            fill="url(#sa-nucleus)"
            fillOpacity="0.5"
            stroke="#5b21b6"
            strokeWidth="1.2"
          />
          <circle cx="-40" cy="-10" r="6" fill="#5b21b6" opacity="0.6" />
          <text
            x="-40"
            y="22"
            fontSize="7"
            fontWeight="600"
            fill="#5b21b6"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Nucleus
          </text>

          {/* Mitochondrion 1 — with cristae (pulsing) */}
          <g transform="translate(40, 10)">
            <ellipse
              cx="0"
              cy="0"
              rx="32"
              ry="14"
              fill="url(#sa-mito)"
              fillOpacity="0.6"
              stroke="#9a3412"
              strokeWidth="1.2"
              className="sa-mito-pulse"
            />
            {[-20, -8, 4, 16].map((cx) => (
              <path
                key={cx}
                d={`M ${cx} -8 Q ${cx} 0 ${cx} 8`}
                fill="none"
                stroke="#7c2d12"
                strokeWidth="0.8"
              />
            ))}
            <text
              x="0"
              y="24"
              fontSize="7"
              fontWeight="600"
              fill="#7c2d12"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              Mitochondrion
            </text>
          </g>

          {/* ER (rough) — small squiggle */}
          <g transform="translate(60, -30)">
            <path
              d="M -16 0 Q -8 -6 0 0 T 16 0"
              fill="none"
              stroke="#0891b2"
              strokeWidth="1.2"
            />
            {[-10, -2, 6, 14].map((cx) => (
              <circle key={cx} cx={cx} cy={-1} r="0.9" fill="#0e7490" />
            ))}
            <text
              x="0"
              y="14"
              fontSize="7"
              fontWeight="600"
              fill="#0e7490"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              rER
            </text>
          </g>

          {/* Lysosome */}
          <g transform="translate(-70, 20)">
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="#a3e635"
              fillOpacity="0.7"
              stroke="#3f6212"
              strokeWidth="1"
            />
            <circle cx="-2" cy="-2" r="3" fill="#fff" opacity="0.6" />
            <text
              x="0"
              y="20"
              fontSize="7"
              fontWeight="600"
              fill="#3f6212"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              Lysosome
            </text>
          </g>
        </g>
      </g>

      {/* ═══ Panel C: Bar chart with error bars (right) ═══ */}
      <g transform="translate(420, 180)">
        <text
          x="0"
          y="0"
          fontSize="10"
          fontWeight="700"
          fill="#0f172a"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          C · Quantification
        </text>
        <text
          x="100"
          y="0"
          fontSize="8"
          fill="#64748b"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          mean ± SEM, n=4
        </text>

        {/* Y-axis */}
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="120"
          stroke="#94a3b8"
          strokeWidth="1"
        />
        {/* X-axis */}
        <line
          x1="20"
          y1="120"
          x2="340"
          y2="120"
          stroke="#94a3b8"
          strokeWidth="1"
        />
        {/* Y-tick labels */}
        {[120, 90, 60, 30].map((y, i) => (
          <g key={y}>
            <line
              x1="16"
              y1={y}
              x2="20"
              y2={y}
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <text
              x="14"
              y={y + 3}
              fontSize="6"
              fill="#64748b"
              textAnchor="end"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {4 - i}
            </text>
          </g>
        ))}

        {/* Bars with error bars — grow on mount */}
        {[
          {
            x: 50,
            w: 40,
            h: 30,
            fill: 'url(#sa-bar-1)',
            err: 4,
            label: 'Mock',
          },
          { x: 130, w: 40, h: 55, fill: 'url(#sa-bar-2)', err: 6, label: 'WT' },
          { x: 210, w: 40, h: 42, fill: 'url(#sa-bar-1)', err: 5, label: 'KO' },
          {
            x: 290,
            w: 40,
            h: 80,
            fill: 'url(#sa-bar-3)',
            err: 7,
            label: 'Treat',
          },
        ].map((bar, i) => (
          <g key={i}>
            <motion.rect
              x={bar.x}
              y={120 - bar.h}
              width={bar.w}
              height={bar.h}
              fill={bar.fill}
              rx="3"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: 0.4 + i * 0.15,
                duration: 0.6,
                ease: 'easeOut',
              }}
              style={{ transformOrigin: `${bar.x + bar.w / 2}px 120px` }}
            />
            {/* Error bar */}
            <line
              x1={bar.x + bar.w / 2}
              y1={120 - bar.h - bar.err}
              x2={bar.x + bar.w / 2}
              y2={120 - bar.h + bar.err}
              stroke="#0f172a"
              strokeWidth="1"
            />
            <line
              x1={bar.x + bar.w / 2 - 4}
              y1={120 - bar.h - bar.err}
              x2={bar.x + bar.w / 2 + 4}
              y2={120 - bar.h - bar.err}
              stroke="#0f172a"
              strokeWidth="1"
            />
            <line
              x1={bar.x + bar.w / 2 - 4}
              y1={120 - bar.h + bar.err}
              x2={bar.x + bar.w / 2 + 4}
              y2={120 - bar.h + bar.err}
              stroke="#0f172a"
              strokeWidth="1"
            />
            <text
              x={bar.x + bar.w / 2}
              y="135"
              fontSize="7"
              fill="#475569"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {bar.label}
            </text>
          </g>
        ))}

        {/* Significance bracket */}
        <g transform="translate(130, 25)">
          <line
            x1="0"
            y1="0"
            x2="200"
            y2="0"
            stroke="#475569"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="-3"
            x2="0"
            y2="3"
            stroke="#475569"
            strokeWidth="0.8"
          />
          <line
            x1="200"
            y1="-3"
            x2="200"
            y2="3"
            stroke="#475569"
            strokeWidth="0.8"
          />
          <text
            x="100"
            y="-3"
            fontSize="8"
            fontWeight="700"
            fill="#475569"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            ****
          </text>
        </g>
      </g>

      {/* ═══ Divider ═══ */}
      <line
        x1="20"
        y1="340"
        x2="780"
        y2="340"
        stroke="#e2e8f0"
        strokeWidth="1"
      />

      {/* ═══ Panel D: Volcano plot (left half) ═══ */}
      <g transform="translate(0, 360)">
        <text
          x="24"
          y="0"
          fontSize="10"
          fontWeight="700"
          fill="#0f172a"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          D · Volcano
        </text>
        <text
          x="76"
          y="0"
          fontSize="8"
          fill="#64748b"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          Differential expression
        </text>

        {/* Axes */}
        <line
          x1="60"
          y1="20"
          x2="60"
          y2="130"
          stroke="#94a3b8"
          strokeWidth="1"
        />
        <line
          x1="60"
          y1="130"
          x2="380"
          y2="130"
          stroke="#94a3b8"
          strokeWidth="1"
        />
        <text
          x="220"
          y="148"
          fontSize="8"
          fill="#475569"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          log₂ fold change
        </text>
        <text
          x="20"
          y="75"
          fontSize="8"
          fill="#475569"
          textAnchor="middle"
          transform="rotate(-90 20 75)"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          −log₁₀ p
        </text>

        {/* Threshold lines */}
        <line
          x1="60"
          y1="35"
          x2="380"
          y2="35"
          stroke="#dc2626"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          opacity="0.6"
        />
        <line
          x1="160"
          y1="130"
          x2="160"
          y2="20"
          stroke="#dc2626"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          opacity="0.6"
        />
        <line
          x1="280"
          y1="130"
          x2="280"
          y2="20"
          stroke="#dc2626"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          opacity="0.6"
        />

        {/* Scatter points — animated */}
        {[
          { x: 100, y: 80, c: '#94a3b8' },
          { x: 120, y: 90, c: '#94a3b8' },
          { x: 135, y: 70, c: '#94a3b8' },
          { x: 150, y: 95, c: '#94a3b8' },
          { x: 170, y: 50, c: '#0ea5e9' },
          { x: 185, y: 60, c: '#94a3b8' },
          { x: 200, y: 85, c: '#94a3b8' },
          { x: 215, y: 75, c: '#94a3b8' },
          { x: 230, y: 95, c: '#94a3b8' },
          { x: 250, y: 45, c: '#0ea5e9' },
          { x: 270, y: 80, c: '#94a3b8' },
          { x: 295, y: 40, c: '#dc2626' },
          { x: 310, y: 50, c: '#0ea5e9' },
          { x: 330, y: 35, c: '#dc2626' },
          { x: 350, y: 55, c: '#0ea5e9' },
          { x: 360, y: 45, c: '#dc2626' },
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.c === '#dc2626' ? 4 : 2.5}
            fill={p.c}
            opacity={p.c === '#94a3b8' ? 0.5 : 1}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5 + i * 0.04,
              duration: 0.4,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Labels for hit points */}
        <text
          x="300"
          y="32"
          fontSize="7"
          fontWeight="700"
          fill="#dc2626"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          GeneA
        </text>
        <text
          x="335"
          y="27"
          fontSize="7"
          fontWeight="700"
          fill="#dc2626"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          GeneB
        </text>
      </g>

      {/* ═══ Panel E: Protein structure + sparkline (right half) ═══ */}
      <g transform="translate(400, 360)">
        <text
          x="0"
          y="0"
          fontSize="10"
          fontWeight="700"
          fill="#0f172a"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          E · Structure
        </text>
        <text
          x="60"
          y="0"
          fontSize="8"
          fill="#64748b"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          AlphaFold prediction
        </text>

        {/* Protein ribbon — 2 alpha helices + loops */}
        <g transform="translate(40, 80)">
          <motion.g
            initial={{ rotate: -2 }}
            animate={{ rotate: 2 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 4,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: 'center' }}
          >
            {/* Helix 1 — coiled spiral */}
            {Array.from({ length: 6 }).map((_, i) => (
              <ellipse
                key={`h1-${i}`}
                cx={-30 + i * 12}
                cy={0}
                rx="6"
                ry="14"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            ))}
            {/* Loop */}
            <path
              d="M -30 0 Q 50 0 60 0"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
            />
            {/* Helix 2 */}
            {Array.from({ length: 6 }).map((_, i) => (
              <ellipse
                key={`h2-${i}`}
                cx={80 + i * 12}
                cy={0}
                rx="6"
                ry="14"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            ))}
            {/* Loop back */}
            <path
              d="M 152 0 Q 180 30 200 30 Q 220 30 200 0"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
            />
            {/* Beta sheet — arrows */}
            {[-10, 20, 50, 80].map((x) => (
              <path
                key={x}
                d={`M ${x} 20 L ${x + 5} 24 L ${x} 28 L ${x - 5} 24 Z`}
                fill="#06b6d4"
                stroke="#0e7490"
                strokeWidth="0.5"
                opacity="0.8"
              />
            ))}
          </motion.g>
        </g>

        {/* Mini sparkline below */}
        <g transform="translate(40, 130)">
          <text
            x="0"
            y="0"
            fontSize="8"
            fill="#64748b"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            pLDDT confidence
          </text>
          <motion.path
            d="M 0 22 Q 30 8 60 14 T 120 6 T 180 12 T 240 4 T 320 8"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.4, duration: 1.4, ease: 'easeOut' }}
          />
        </g>
      </g>

      {/* ═══ Bottom legend strip ═══ */}
      <g transform="translate(20, 524)">
        <circle cx="4" cy="0" r="3" fill="#0ea5e9" />
        <text
          x="12"
          y="3"
          fontSize="7"
          fill="#475569"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          activated
        </text>
        <circle cx="68" cy="0" r="3" fill="#dc2626" />
        <text
          x="76"
          y="3"
          fontSize="7"
          fill="#475569"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          up-regulated
        </text>
        <circle cx="146" cy="0" r="3" fill="#94a3b8" />
        <text
          x="154"
          y="3"
          fontSize="7"
          fill="#475569"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          ns
        </text>
        <text
          x="180"
          y="3"
          fontSize="7"
          fontWeight="600"
          fill="#0f172a"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          SciDrawer AI · 2026
        </text>
      </g>
    </svg>
  );
}
