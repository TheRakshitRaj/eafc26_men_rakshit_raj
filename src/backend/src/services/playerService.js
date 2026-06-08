import Player from '../models/Player.js';
import ApiFeatures from '../utils/ApiFeatures.js';
import getPaginationData from '../utils/pagination.js';
import buildFilters from '../utils/buildFilters.js';

class PlayerService {
  async getPlayers(queryStr) {
    // Determine filters for base count
    const filters = buildFilters(queryStr);
    
    // Resolve keyword search regex in the count if "q" is provided
    if (queryStr.q) {
      const searchPattern = new RegExp(queryStr.q, 'i');
      filters.$or = ['name', 'team', 'league', 'nation'].map(field => ({
        [field]: { $regex: searchPattern }
      }));
    }

    const totalPlayers = await Player.countDocuments(filters);

    // Apply API Features to Mongoose query
    const apiFeatures = new ApiFeatures(Player.find(), queryStr)
      .filter()
      .search(['name', 'team', 'league', 'nation'])
      .sort()
      .limitFields()
      .paginate();

    // Use lean query structure for speed optimizations
    const players = await apiFeatures.query.lean();

    const page = parseInt(queryStr.page, 10) || 1;
    const limit = parseInt(queryStr.limit, 10) || 10;
    const pagination = getPaginationData(totalPlayers, page, limit);

    return {
      players,
      pagination,
    };
  }

  async getPlayerById(id) {
    const player = await Player.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
    
    if (!player) {
      const error = new Error('Player not found');
      error.statusCode = 404;
      throw error;
    }
    
    return player;
  }

  async createPlayer(playerData) {
    const player = await Player.create(playerData);
    return player;
  }

  async updatePlayer(id, updateData) {
    const player = await Player.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      updateData,
      { new: true, runValidators: true }
    );

    if (!player) {
      const error = new Error('Player not found or has been soft-deleted');
      error.statusCode = 404;
      throw error;
    }

    return player;
  }

  async softDeletePlayer(id) {
    const player = await Player.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!player) {
      const error = new Error('Player not found or already deleted');
      error.statusCode = 404;
      throw error;
    }

    return player;
  }

  async getRandomPlayer() {
    const result = await Player.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $sample: { size: 1 } }
    ]);
    return result[0] || null;
  }

  async getTrendingPlayers() {
    return await Player.find({ isDeleted: { $ne: true }, overall: { $gte: 86 } })
      .sort('-overall')
      .limit(10)
      .lean();
  }

  async getRecommendations(position, overall) {
    let targetPosition = position;
    let targetOverall = parseInt(overall, 10);

    if (!targetPosition || isNaN(targetOverall)) {
      const randomPlayer = await Player.findOne({ isDeleted: { $ne: true } }).lean();
      if (randomPlayer) {
        targetPosition = randomPlayer.position;
        targetOverall = randomPlayer.overall;
      } else {
        return [];
      }
    }

    return await Player.find({
      isDeleted: { $ne: true },
      position: targetPosition,
      overall: { $gte: targetOverall - 3, $lte: targetOverall + 3 }
    })
    .limit(5)
    .lean();
  }

  async getDreamTeam() {
    const formation = {
      GK: 1,
      CB: 2,
      LB: 1,
      RB: 1,
      CM: 2,
      CDM: 1,
      LW: 1,
      RW: 1,
      ST: 1
    };

    const dreamTeam = [];
    for (const [pos, count] of Object.entries(formation)) {
      const topPlayers = await Player.find({ 
        isDeleted: { $ne: true }, 
        position: pos 
      })
      .sort('-overall')
      .limit(count)
      .lean();

      dreamTeam.push(...topPlayers);
    }

    dreamTeam.sort((a, b) => b.overall - a.overall);
    const avgRating = dreamTeam.reduce((sum, p) => sum + p.overall, 0) / (dreamTeam.length || 1);

    return {
      formation: '4-3-3',
      avgOverall: Math.round(avgRating * 10) / 10,
      players: dreamTeam
    };
  }

  async getTeamBuilder(team, league) {
    const filter = { isDeleted: { $ne: true } };
    if (team) {
      filter.team = { $regex: new RegExp(team, 'i') };
    } else if (league) {
      filter.league = { $regex: new RegExp(league, 'i') };
    } else {
      filter.league = 'Premier League';
    }

    const matchedPlayers = await Player.find(filter).sort('-overall').lean();

    const gk = matchedPlayers.filter(p => p.position === 'GK').slice(0, 1);
    const def = matchedPlayers.filter(p => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position)).slice(0, 4);
    const mid = matchedPlayers.filter(p => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.position)).slice(0, 3);
    const fwd = matchedPlayers.filter(p => ['ST', 'LW', 'RW', 'CF'].includes(p.position)).slice(0, 3);

    const squad = [...gk, ...def, ...mid, ...fwd];
    const avgRating = squad.reduce((sum, p) => sum + p.overall, 0) / (squad.length || 1);

    return {
      searchFilter: { team, league: team ? undefined : (league || 'Premier League') },
      formation: '4-3-3',
      squadSize: squad.length,
      avgOverall: Math.round(avgRating * 10) / 10,
      players: squad
    };
  }

  async calculateChemistry(playerIds) {
    if (!playerIds || playerIds.length === 0) {
      return { totalChemistry: 0, players: [] };
    }

    const players = await Player.find({
      _id: { $in: playerIds },
      isDeleted: { $ne: true }
    }).lean();

    const teamCounts = {};
    const nationCounts = {};
    const leagueCounts = {};

    players.forEach(p => {
      teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
      nationCounts[p.nation] = (nationCounts[p.nation] || 0) + 1;
      leagueCounts[p.league] = (leagueCounts[p.league] || 0) + 1;
    });

    const calculatedPlayers = players.map(p => {
      let chem = 0;

      // Club matches
      const tCount = teamCounts[p.team] || 0;
      if (tCount >= 7) chem += 3;
      else if (tCount >= 4) chem += 2;
      else if (tCount >= 2) chem += 1;

      // Nation matches
      const nCount = nationCounts[p.nation] || 0;
      if (nCount >= 8) chem += 3;
      else if (nCount >= 5) chem += 2;
      else if (nCount >= 2) chem += 1;

      // League matches
      const lCount = leagueCounts[p.league] || 0;
      if (lCount >= 8) chem += 3;
      else if (lCount >= 5) chem += 2;
      else if (lCount >= 3) chem += 1;

      chem = Math.min(chem, 3);

      return {
        playerId: p._id,
        name: p.name,
        team: p.team,
        league: p.league,
        nation: p.nation,
        chemistryPoints: chem
      };
    });

    const totalChemistry = calculatedPlayers.reduce((sum, p) => sum + p.chemistryPoints, 0);
    const maxPossibleChemistry = players.length * 3;

    return {
      chemistrySummary: `${totalChemistry}/${maxPossibleChemistry}`,
      totalChemistry,
      maxPossibleChemistry,
      players: calculatedPlayers
    };
  }

  async getLiveSearch(q) {
    if (!q) return [];
    const searchPattern = new RegExp(q, 'i');
    return await Player.find({
      isDeleted: { $ne: true },
      $or: ['name', 'team', 'league', 'nation'].map(field => ({
        [field]: { $regex: searchPattern }
      }))
    })
    .select('name overall team position card')
    .limit(10)
    .lean();
  }
}

export default new PlayerService();
