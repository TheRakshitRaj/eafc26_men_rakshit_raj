export const registerValidator = (body) => {
  const errors = {};

  if (!body.username || typeof body.username !== 'string' || body.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }
  if (!body.email || typeof body.email !== 'string' || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email)) {
    errors.email = 'Please provide a valid email address';
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  if (body.role && !['user', 'admin'].includes(body.role)) {
    errors.role = 'Role must be either user or admin';
  }

  const hasErrors = Object.keys(errors).length > 0;
  return {
    error: hasErrors ? errors : null,
    value: hasErrors ? null : {
      username: body.username?.trim(),
      email: body.email?.trim().toLowerCase(),
      password: body.password,
      role: body.role || 'user'
    }
  };
};

export const loginValidator = (body) => {
  const errors = {};

  if (!body.email || typeof body.email !== 'string') {
    errors.email = 'Email is required';
  }
  if (!body.password || typeof body.password !== 'string') {
    errors.password = 'Password is required';
  }

  const hasErrors = Object.keys(errors).length > 0;
  return {
    error: hasErrors ? errors : null,
    value: hasErrors ? null : {
      email: body.email?.trim().toLowerCase(),
      password: body.password
    }
  };
};
