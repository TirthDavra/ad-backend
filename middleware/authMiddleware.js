import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorResponse } from '../utils/response.js';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, { status: 401, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return errorResponse(res, { status: 403, message: 'Invalid or expired token.' });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return errorResponse(res, { status: 403, message: 'Forbidden. Insufficient permissions.' });
  }
  return next();
};
