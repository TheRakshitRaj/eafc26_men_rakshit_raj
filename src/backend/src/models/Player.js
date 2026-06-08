import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Player name is required'],
      trim: true,
      index: true,
    },
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Overall rating must be at least 1'],
      max: [99, 'Overall rating cannot exceed 99'],
      index: true,
    },
    pace: {
      type: Number,
      required: [true, 'Pace rating is required'],
      min: [1, 'Pace must be at least 1'],
      max: [99, 'Pace cannot exceed 99'],
      index: true,
    },
    shooting: {
      type: Number,
      required: [true, 'Shooting rating is required'],
      min: [1, 'Shooting must be at least 1'],
      max: [99, 'Shooting cannot exceed 99'],
    },
    passing: {
      type: Number,
      required: [true, 'Passing rating is required'],
      min: [1, 'Passing must be at least 1'],
      max: [99, 'Passing cannot exceed 99'],
    },
    dribbling: {
      type: Number,
      required: [true, 'Dribbling rating is required'],
      min: [1, 'Dribbling must be at least 1'],
      max: [99, 'Dribbling cannot exceed 99'],
    },
    defending: {
      type: Number,
      required: [true, 'Defending rating is required'],
      min: [1, 'Defending must be at least 1'],
      max: [99, 'Defending cannot exceed 99'],
      index: true,
    },
    physical: {
      type: Number,
      required: [true, 'Physical rating is required'],
      min: [1, 'Physical must be at least 1'],
      max: [99, 'Physical cannot exceed 99'],
    },
    team: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      index: true,
    },
    league: {
      type: String,
      required: [true, 'League name is required'],
      trim: true,
      index: true,
    },
    nation: {
      type: String,
      required: [true, 'Nation is required'],
      trim: true,
      index: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [15, 'Minimum age is 15'],
      max: [50, 'Maximum age is 50'],
    },
    playstyles: {
      type: [String],
      default: [],
    },
    weakFoot: {
      type: Number,
      required: [true, 'Weak Foot rating is required'],
      min: [1, 'Weak foot must be at least 1 star'],
      max: [5, 'Weak foot cannot exceed 5 stars'],
    },
    skillMoves: {
      type: Number,
      required: [true, 'Skill Moves rating is required'],
      min: [1, 'Skill moves must be at least 1 star'],
      max: [5, 'Skill moves cannot exceed 5 stars'],
    },
    preferredFoot: {
      type: String,
      required: [true, 'Preferred foot is required'],
      enum: {
        values: ['Left', 'Right'],
        message: '{VALUE} is not a valid preferred foot (Left or Right)',
      },
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female'],
        message: '{VALUE} is not a valid gender (Male or Female)',
      },
      default: 'Male',
    },
    rank: {
      type: Number,
      default: null,
    },
    card: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for complex searches
playerSchema.index({ team: 1, overall: -1 });
playerSchema.index({ league: 1, overall: -1 });
playerSchema.index({ nation: 1, overall: -1 });

const Player = mongoose.model('Player', playerSchema);
export default Player;
