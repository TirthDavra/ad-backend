export const successResponse = (res, { status = 200, message = '', data = null }) => {
  return res.status(status).json({ status: true, message, data });
};

export const errorResponse = (res, { status = 500, message = 'Server Error', errors = null }) => {
  const payload = { status: false, message };
  if (errors) payload.errors = errors;
  return res.status(status).json(payload);
};
