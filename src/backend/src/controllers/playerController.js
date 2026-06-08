import playerService from '../services/playerService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// --- Core CRUD Operations ---

export const getPlayers = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers(req.query);
  return ApiResponse.success(res, result.players, 'Players fetched successfully', 200, result.pagination);
});

export const getPlayerById = asyncHandler(async (req, res) => {
  const player = await playerService.getPlayerById(req.params.id);
  return ApiResponse.success(res, player, 'Player details fetched successfully', 200);
});

export const createPlayer = asyncHandler(async (req, res) => {
  const player = await playerService.createPlayer(req.body);
  return ApiResponse.success(res, player, 'Player created successfully', 201);
});

export const updatePlayer = asyncHandler(async (req, res) => {
  const player = await playerService.updatePlayer(req.params.id, req.body);
  return ApiResponse.success(res, player, 'Player updated successfully', 200);
});

export const deletePlayer = asyncHandler(async (req, res) => {
  await playerService.softDeletePlayer(req.params.id);
  return ApiResponse.success(res, {}, 'Player soft-deleted successfully', 200);
});

// --- Filtering & Attribute Lookups ---

export const getPlayersByTeam = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, team: req.params.team });
  return ApiResponse.success(res, result.players, `Players for team '${req.params.team}' fetched successfully`, 200, result.pagination);
});

export const getPlayersByLeague = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, league: req.params.league });
  return ApiResponse.success(res, result.players, `Players for league '${req.params.league}' fetched successfully`, 200, result.pagination);
});

export const getPlayersByNation = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, nation: req.params.nation });
  return ApiResponse.success(res, result.players, `Players from nation '${req.params.nation}' fetched successfully`, 200, result.pagination);
});

export const getPlayersByPosition = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, position: req.params.position });
  return ApiResponse.success(res, result.players, `Players in position '${req.params.position.toUpperCase()}' fetched successfully`, 200, result.pagination);
});

// --- Stat Rankings ---

export const getTopRated = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, sort: '-overall' });
  return ApiResponse.success(res, result.players, 'Top rated players fetched successfully', 200, result.pagination);
});

export const getTopPaced = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, sort: '-pace' });
  return ApiResponse.success(res, result.players, 'Top paced players fetched successfully', 200, result.pagination);
});

export const getTopDribblers = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, sort: '-dribbling' });
  return ApiResponse.success(res, result.players, 'Top dribblers fetched successfully', 200, result.pagination);
});

export const getTopPassers = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, sort: '-passing' });
  return ApiResponse.success(res, result.players, 'Top passers fetched successfully', 200, result.pagination);
});

export const getTopDefenders = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, sort: '-defending' });
  return ApiResponse.success(res, result.players, 'Top defenders fetched successfully', 200, result.pagination);
});

export const getTopYoungsters = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, age_lte: 23, sort: '-overall' });
  return ApiResponse.success(res, result.players, 'Top youngsters (age <= 23) fetched successfully', 200, result.pagination);
});

export const getRecentPlayers = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers({ ...req.query, sort: '-createdAt' });
  return ApiResponse.success(res, result.players, 'Recently added players fetched successfully', 200, result.pagination);
});

// --- Advanced Engine Calculations ---

export const getRandomPlayer = asyncHandler(async (req, res) => {
  const player = await playerService.getRandomPlayer();
  return ApiResponse.success(res, player, 'Random player document retrieved successfully', 200);
});

export const getTrendingPlayers = asyncHandler(async (req, res) => {
  const players = await playerService.getTrendingPlayers();
  return ApiResponse.success(res, players, 'Trending player profiles fetched successfully', 200);
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const players = await playerService.getRecommendations(req.query.position, req.query.overall);
  return ApiResponse.success(res, players, 'Player recommendation list generated successfully', 200);
});

export const getDreamTeam = asyncHandler(async (req, res) => {
  const dreamTeam = await playerService.getDreamTeam();
  return ApiResponse.success(res, dreamTeam, 'EA FC 26 Dream Team squad constructed successfully', 200);
});

export const getTeamBuilder = asyncHandler(async (req, res) => {
  const builder = await playerService.getTeamBuilder(req.query.team, req.query.league);
  return ApiResponse.success(res, builder, 'Squad starting XI recommended successfully', 200);
});

export const calculateChemistry = asyncHandler(async (req, res) => {
  const playerIds = req.query.playerIds ? req.query.playerIds.split(',').map(id => id.trim()).filter(Boolean) : [];
  const chemResult = await playerService.calculateChemistry(playerIds);
  return ApiResponse.success(res, chemResult, 'EA Sports Chemistry score evaluated successfully', 200);
});

export const getLiveSearch = asyncHandler(async (req, res) => {
  const results = await playerService.getLiveSearch(req.query.q);
  return ApiResponse.success(res, results, 'Live typeahead search results fetched successfully', 200);
});
