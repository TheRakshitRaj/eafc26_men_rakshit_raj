import Player from '../models/Player.js';

class AnalyticsService {
  // Top 10 Rated Players
  async getTopRated() {
    return await Player.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $sort: { overall: -1, rank: 1 } },
      { $limit: 10 },
      {
        $project: {
          name: 1,
          overall: 1,
          position: 1,
          team: 1,
          league: 1,
          nation: 1,
          pace: 1,
          shooting: 1,
          passing: 1,
          dribbling: 1,
          defending: 1,
          physical: 1,
        },
      },
    ]);
  }

  // Top Teams by Average Overall Rating (min 2 players to avoid single-player skew in seed)
  async getTopTeams() {
    return await Player.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: '$team',
          avgOverall: { $avg: '$overall' },
          playerCount: { $sum: 1 },
          maxOverall: { $max: '$overall' },
          avgPace: { $avg: '$pace' },
        },
      },
      { $sort: { avgOverall: -1 } },
      { $limit: 10 },
      {
        $project: {
          team: '$_id',
          _id: 0,
          avgOverall: { $round: ['$avgOverall', 1] },
          playerCount: 1,
          maxOverall: 1,
          avgPace: { $round: ['$avgPace', 1] },
        },
      },
    ]);
  }

  // Top Leagues by Average Overall Rating
  async getTopLeagues() {
    return await Player.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: '$league',
          avgOverall: { $avg: '$overall' },
          playerCount: { $sum: 1 },
          maxOverall: { $max: '$overall' },
        },
      },
      { $sort: { avgOverall: -1 } },
      { $limit: 10 },
      {
        $project: {
          league: '$_id',
          _id: 0,
          avgOverall: { $round: ['$avgOverall', 1] },
          playerCount: 1,
          maxOverall: 1,
        },
      },
    ]);
  }

  // Top Nations representation & ratings
  async getTopNations() {
    return await Player.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: '$nation',
          avgOverall: { $avg: '$overall' },
          playerCount: { $sum: 1 },
        },
      },
      { $sort: { playerCount: -1, avgOverall: -1 } },
      { $limit: 10 },
      {
        $project: {
          nation: '$_id',
          _id: 0,
          avgOverall: { $round: ['$avgOverall', 1] },
          playerCount: 1,
        },
      },
    ]);
  }

  // Position distribution and stats
  async getPositionDistribution() {
    return await Player.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: '$position',
          count: { $sum: 1 },
          avgOverall: { $avg: '$overall' },
          avgPace: { $avg: '$pace' },
          avgShooting: { $avg: '$shooting' },
          avgDefending: { $avg: '$defending' },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          position: '$_id',
          _id: 0,
          count: 1,
          avgOverall: { $round: ['$avgOverall', 1] },
          avgPace: { $round: ['$avgPace', 1] },
          avgShooting: { $round: ['$avgShooting', 1] },
          avgDefending: { $round: ['$avgDefending', 1] },
        },
      },
    ]);
  }

  // Count & Average overall grouped by Skill Moves and Weak Foot
  async getSkillDistribution() {
    return await Player.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: {
            skillMoves: '$skillMoves',
            weakFoot: '$weakFoot'
          },
          count: { $sum: 1 },
          avgOverall: { $avg: '$overall' }
        }
      },
      { $sort: { '_id.skillMoves': -1, '_id.weakFoot': -1 } },
      {
        $project: {
          skillMoves: '$_id.skillMoves',
          weakFoot: '$_id.weakFoot',
          _id: 0,
          count: 1,
          avgOverall: { $round: ['$avgOverall', 1] }
        }
      }
    ]);
  }
}

export default new AnalyticsService();
