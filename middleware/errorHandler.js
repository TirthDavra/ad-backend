export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || undefined,
  });
};
