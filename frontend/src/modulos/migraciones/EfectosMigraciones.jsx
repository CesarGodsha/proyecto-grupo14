export default function EfectosMigraciones() {
  return (
    <div className="mig-fx-capa" aria-hidden="true">
      {/* Estela de ruta / radar sutil */}
      <div className="mig-fx-grid" />

      {/* Avión cruzando el cielo con estela */}
      <div className="mig-avion-ruta">
        <span className="mig-estela" />
        <svg
          className="mig-avion-svg"
          viewBox="0 0 64 64"
          width="46"
          height="46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M58 28L38 24L22 8H16L25 25L11 27L5 21H2L6 31L2 41H5L11 35L25 37L16 54H22L38 38L58 34C60.5 33.5 62 32.2 62 31C62 29.8 60.5 28.5 58 28Z"
            fill="#f8fafc"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Camión avanzando por la vía inferior */}
      <div className="mig-camion-pista">
        <div className="mig-camion-mover">
          <svg
            className="mig-camion-svg"
            viewBox="0 0 96 44"
            width="78"
            height="36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Contenedor / carga */}
            <rect
              x="6"
              y="8"
              width="52"
              height="22"
              rx="4"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <line x1="18" y1="13" x2="18" y2="25" stroke="#334155" strokeWidth="2" />
            <line x1="32" y1="13" x2="32" y2="25" stroke="#334155" strokeWidth="2" />
            <line x1="46" y1="13" x2="46" y2="25" stroke="#334155" strokeWidth="2" />

            {/* Cabina */}
            <path
              d="M58 14H76L84 22V30H58V14Z"
              fill="#059669"
              stroke="#a7f3d0"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M64 17H74L79 22H64V17Z" fill="#0f172a" />

            {/* Ruedas */}
            <circle cx="22" cy="33" r="6" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2.5" />
            <circle cx="72" cy="33" r="6" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="mig-via-linea" />
      </div>
    </div>
  );
}