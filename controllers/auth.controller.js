import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { validateRegister, validateLogin } from '../utils/validators.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const validationErrors = validateRegister({ name, email, password });

    if (validationErrors.length) {
      return errorResponse(res, {
        status: 400,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, { status: 400, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: 'user' });
    await newUser.save();

    return successResponse(res, {
      status: 201,
      message: 'User registered successfully',
      data: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validationErrors = validateLogin({ email, password });

    if (validationErrors.length) {
      return errorResponse(res, {
        status: 400,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, { status: 401, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const resultUser = await User.findById(user._id).select('-password -__v');
    return successResponse(res, {
      status: 200,
      message: 'Login successful',
      data: { user: resultUser, token },
    });
  } catch (error) {
    next(error);
  }
};
