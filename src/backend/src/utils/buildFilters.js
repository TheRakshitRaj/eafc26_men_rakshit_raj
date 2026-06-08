const buildFilters = (query) => {
  const filter = { isDeleted: { $ne: true } };

  // Simple string exact matches/contains
  if (query.name) {
    filter.name = { $regex: new RegExp(query.name, 'i') };
  }
  if (query.team) {
    filter.team = { $regex: new RegExp(query.team, 'i') };
  }
  if (query.league) {
    filter.league = { $regex: new RegExp(query.league, 'i') };
  }
  if (query.nation) {
    filter.nation = { $regex: new RegExp(query.nation, 'i') };
  }
  if (query.position) {
    // Handle comma-separated positions or a single position
    if (typeof query.position === 'string' && query.position.includes(',')) {
      filter.position = { $in: query.position.split(',').map(pos => pos.trim().toUpperCase()) };
    } else {
      filter.position = String(query.position).trim().toUpperCase();
    }
  }
  if (query.preferredFoot) {
    filter.preferredFoot = String(query.preferredFoot).trim();
  }
  if (query.gender) {
    filter.gender = String(query.gender).trim();
  }

  // Numeric fields and operators
  const numericFields = [
    'overall', 'pace', 'shooting', 'passing', 'dribbling', 
    'defending', 'physical', 'age', 'weakFoot', 'skillMoves', 'rank'
  ];

  numericFields.forEach((field) => {
    const condition = {};

    // Allow direct field queries: overall=91
    if (query[field] && typeof query[field] !== 'object') {
      const val = Number(query[field]);
      if (!isNaN(val)) filter[field] = val;
    }

    // Allow operator suffixes: overall_gte=90
    ['gte', 'gt', 'lte', 'lt', 'ne'].forEach((op) => {
      const key = `${field}_${op}`;
      if (query[key]) {
        const val = Number(query[key]);
        if (!isNaN(val)) {
          condition[`$${op}`] = val;
        }
      }
    });

    if (Object.keys(condition).length > 0) {
      filter[field] = { ...filter[field], ...condition };
    }
  });

  // Playstyles array contains check
  if (query.playstyles) {
    const playstylesArray = String(query.playstyles).split(',').map(p => p.trim());
    filter.playstyles = { $all: playstylesArray };
  }

  return filter;
};

export default buildFilters;
