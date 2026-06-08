import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

class AuthService {
  async register(userData) {
    const { username, email, password, role } = userData;

    // Check email uniqueness
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      const error = new Error('A user with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    // Check username uniqueness
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      const error = new Error('A user with this username already exists');
      error.statusCode = 400;
      throw error;
    }

    // Create user in database (pre-save hashes password)
    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Validate password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export default new AuthService();
