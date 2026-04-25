import Post from '../models/Post.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { validatePost } from '../utils/validators.js';

export const getAllPost = async (req, res, next) => {
  try {
    const allPost = await Post.find();
    return successResponse(res, { status: 200, message: 'Posts retrieved successfully', data: allPost });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return errorResponse(res, { status: 404, message: 'Post not found' });
    }
    return successResponse(res, { status: 200, message: 'Post retrieved successfully', data: post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const validationErrors = validatePost(req.body);
    if (validationErrors.length) {
      return errorResponse(res, { status: 400, message: 'Validation failed', errors: validationErrors });
    }

    const { title, content, image } = req.body;
    const newPost = new Post({ title, content, image });
    const savedPost = await newPost.save();

    return successResponse(res, {
      status: 201,
      message: 'Post created successfully',
      data: savedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validationErrors = validatePost(req.body);
    if (validationErrors.length) {
      return errorResponse(res, { status: 400, message: 'Validation failed', errors: validationErrors });
    }

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return errorResponse(res, { status: 404, message: 'Post not found' });
    }

    const updated = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, { status: 200, message: 'Post updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return errorResponse(res, { status: 404, message: 'Post not found' });
    }
    await Post.findByIdAndDelete(id);
    return successResponse(res, { status: 200, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
