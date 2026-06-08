import Player from '../models/Player.js';
import mongoose from 'mongoose';

class CompareService {
  async comparePlayers(player1Id, player2Id) {
    // Validate MongoDB ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(player1Id) || !mongoose.Types.ObjectId.isValid(player2Id)) {
      const error = new Error('Invalid Player ID format provided for comparison');
      error.statusCode = 400;
      throw error;
    }

    const player1 = await Player.findOne({ _id: player1Id, isDeleted: { $ne: true } }).lean();
    const player2 = await Player.findOne({ _id: player2Id, isDeleted: { $ne: true } }).lean();

    if (!player1 || !player2) {
      const error = new Error(`One or both players could not be found for comparison. Player 1: ${player1 ? 'Found' : 'Not Found'}, Player 2: ${player2 ? 'Found' : 'Not Found'}`);
      error.statusCode = 404;
      throw error;
    }

    const attributes = ['overall', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
    const comparisonStats = {};

    attributes.forEach((attr) => {
      const p1Val = player1[attr];
      const p2Val = player2[attr];
      const diff = p1Val - p2Val;

      comparisonStats[attr] = {
        player1: p1Val,
        player2: p2Val,
        difference: diff,
        winner: diff > 0 ? player1.name : diff < 0 ? player2.name : 'Tie',
      };
    });

    // Calculate total categories won
    let p1Wins = 0;
    let p2Wins = 0;
    attributes.forEach((attr) => {
      if (comparisonStats[attr].winner === player1.name) p1Wins++;
      else if (comparisonStats[attr].winner === player2.name) p2Wins++;
    });

    return {
      players: {
        player1: {
          id: player1._id,
          name: player1.name,
          team: player1.team,
          position: player1.position,
          age: player1.age,
          nation: player1.nation,
          preferredFoot: player1.preferredFoot,
          weakFoot: player1.weakFoot,
          skillMoves: player1.skillMoves,
          playstyles: player1.playstyles,
        },
        player2: {
          id: player2._id,
          name: player2.name,
          team: player2.team,
          position: player2.position,
          age: player2.age,
          nation: player2.nation,
          preferredFoot: player2.preferredFoot,
          weakFoot: player2.weakFoot,
          skillMoves: player2.skillMoves,
          playstyles: player2.playstyles,
        },
      },
      comparison: comparisonStats,
      summary: {
        totalAttributesCompared: attributes.length,
        player1Wins: p1Wins,
        player2Wins: p2Wins,
        overallWinner: p1Wins > p2Wins ? player1.name : p2Wins > p1Wins ? player2.name : 'Tie',
      },
    };
  }
}

export default new CompareService();
