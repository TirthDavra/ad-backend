export const validateRegister = ({ name, email, password }) => {
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required');
  if (!email || !email.trim()) errors.push('Email is required');
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = [];
  if (!email || !email.trim()) errors.push('Email is required');
  if (!password || !password.trim()) errors.push('Password is required');
  return errors;
};

export const validatePost = ({ title, content, image }) => {
  const errors = [];
  if (!title || !title.trim()) errors.push('Title is required');
  if (!content || !content.trim()) errors.push('Content is required');
  if (!image || !image.trim()) errors.push('Image URL is required');
  return errors;
};

export const validateUserUpdate = ({ name, email, role }) => {
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required');
  if (!email || !email.trim()) errors.push('Email is required');
  if (role && !['user', 'admin'].includes(role)) errors.push('Role must be either user or admin');
  return errors;
};
