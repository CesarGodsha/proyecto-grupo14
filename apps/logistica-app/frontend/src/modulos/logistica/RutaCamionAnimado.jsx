export default function RutaCamionAnimado({
  origen = 'HUB HUANCAYO · GORE JUNÍN',
  destino = 'CORREDOR PACÍFICO · FRONTERA',
}) {
  return (
    <div className="log-highway-banner" aria-hidden="true">
      <div className="log-highway-hud">
        <span className="log-highway-node"><i /> {origen}</span>
        <span className="log-highway-node"><i /> {destino}</span>
      </div>

      <div className="log-truck-runner">
        <svg width="168" height="44" viewBox="0 0 168 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="134,24 168,15 168,35 134,31" fill="url(#headlightGrad)" />
          <rect x="0" y="14" width="22" height="2" rx="1" fill="#ea580c" opacity="0.45" />
          <rect x="6" y="22" width="16" height="2" rx="1" fill="#fb923c" opacity="0.35" />

          <rect x="22" y="6" width="78" height="25" rx="3" fill="#0f172a" stroke="#ea580c" strokeWidth="1.6" />
          <line x1="36" y1="9" x2="36" y2="28" stroke="#7c2d12" strokeWidth="1.4" />
          <line x1="50" y1="9" x2="50" y2="28" stroke="#7c2d12" strokeWidth="1.4" />
          <line x1="64" y1="9" x2="64" y2="28" stroke="#7c2d12" strokeWidth="1.4" />
          <line x1="78" y1="9" x2="78" y2="28" stroke="#7c2d12" strokeWidth="1.4" />
          <text x="31" y="21" fill="#fed7aa" fontSize="6.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.8">
            LOGÍSTICAMAX
          </text>

          <rect x="24" y="31" width="106" height="3.5" rx="1.5" fill="#1e293b" />
          <path d="M103 11 H122 L133 21 V31 H103 Z" fill="#291d12" stroke="#fb923c" strokeWidth="1.6" />
          <path d="M115 14 H121 L129 21 H115 Z" fill="#fdba74" fillOpacity="0.45" />
          <rect x="131" y="24" width="3.5" height="4" rx="1" fill="#dbeafe" />

          <circle cx="38" cy="36" r="5.5" fill="#050811" stroke="#fb923c" strokeWidth="1.8" />
          <circle cx="38" cy="36" r="2" fill="#ea580c" />
          <circle cx="53" cy="36" r="5.5" fill="#050811" stroke="#fb923c" strokeWidth="1.8" />
          <circle cx="53" cy="36" r="2" fill="#ea580c" />
          <circle cx="90" cy="36" r="5.5" fill="#050811" stroke="#fb923c" strokeWidth="1.8" />
          <circle cx="90" cy="36" r="2" fill="#ea580c" />
          <circle cx="120" cy="36" r="5.5" fill="#050811" stroke="#fb923c" strokeWidth="1.8" />
          <circle cx="120" cy="36" r="2" fill="#ea580c" />

          <defs>
            <linearGradient id="headlightGrad" x1="134" y1="26" x2="168" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="log-highway-road" />
    </div>
  );
}