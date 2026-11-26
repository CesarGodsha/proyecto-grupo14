export default function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status =
    Number.isInteger(error.status) && error.status >= 400 && error.status < 600
      ? error.status
      : 500;
  if (status >= 500) console.error(error);

  res.status(status).json({
    mensaje:
      status === 500 && error.expose !== true
        ? 'Error interno del servidor'
        : error.message,
  });
}
