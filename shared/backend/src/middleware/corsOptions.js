export default function corsOptions() {
  const origins = String(process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length) return { origin: origins };
  return { origin: process.env.NODE_ENV === 'production' ? false : true };
}
