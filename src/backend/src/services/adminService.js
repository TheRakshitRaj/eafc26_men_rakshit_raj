import User from '../models/User.js';
import Player from '../models/Player.js';

class AdminService {
  async getDashboardStats() {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });

    const totalActivePlayers = await Player.countDocuments({ isDeleted: { $ne: true } });
    const totalDeletedPlayers = await Player.countDocuments({ isDeleted: true });

    // Fetch top 5 recent user profiles
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('username email role createdAt')
      .lean();

    // Fetch top 5 recent players added to the DB
    const recentPlayers = await Player.find({ isDeleted: { $ne: true } })
      .sort('-createdAt')
      .limit(5)
      .select('name overall team position createdAt')
      .lean();

    return {
      users: {
        total: totalUsers,
        admins: adminCount,
        regularUsers: userCount,
      },
      players: {
        active: totalActivePlayers,
        deleted: totalDeletedPlayers,
      },
      recentUsers,
      recentPlayers,
    };
  }
}

export default new AdminService();
