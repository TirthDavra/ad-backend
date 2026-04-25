import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { validateUserUpdate } from '../utils/validators.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -__v');
    return successResponse(res, {
      status: 200,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -__v');

    if (!user) {
      return errorResponse(res, {
        status: 404,
        message: 'User not found',
      });
    }

    return successResponse(res, {
      status: 200,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const validationErrors = validateUserUpdate(updates);

    if (validationErrors.length) {
      return errorResponse(res, {
        status: 400,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, { status: 404, message: 'User not found' });
    }

    const emailInUse = await User.findOne({ email: updates.email, _id: { $ne: id } });
    if (emailInUse) {
      return errorResponse(res, { status: 400, message: 'Email already in use' });
    }

    user.name = updates.name;
    user.email = updates.email;
    if (updates.role) {
      user.role = updates.role;
    }

    await user.save();

    return successResponse(res, {
      status: 200,
      message: 'User updated successfully',
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return errorResponse(res, {
        status: 400,
        message: 'Admin cannot delete their own account from this endpoint',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, { status: 404, message: 'User not found' });
    }

    await user.deleteOne();

    return successResponse(res, {
      status: 200,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
