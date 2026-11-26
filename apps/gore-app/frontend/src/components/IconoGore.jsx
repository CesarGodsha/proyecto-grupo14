export default function IconoGore({ nombre }) {
  let dibujo;

  switch (nombre) {
    case 'archivo':
      dibujo = (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </>
      );
      break;
    case 'buscar':
      dibujo = (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </>
      );
      break;
    case 'bandeja':
      dibujo = (
        <>
          <path d="M4 4h16v16H4z" />
          <path d="M4 13h4l2 3h4l2-3h4" />
        </>
      );
      break;
    case 'seguridad':
      dibujo = (
        <>
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </>
      );
      break;
    case 'persona':
      dibujo = (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </>
      );
      break;
    case 'informacion':
      dibujo = (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </>
      );
      break;
    default:
      return null;
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dibujo}
    </svg>
  );
}
