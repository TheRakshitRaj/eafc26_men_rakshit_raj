export const createPlayerValidator = (body) => {
  const errors = {};

  const requiredStringFields = ['name', 'team', 'league', 'nation', 'position', 'preferredFoot', 'gender'];
  requiredStringFields.forEach((field) => {
    if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
      errors[field] = `${field} is required and must be a non-empty string`;
    }
  });

  const numericFields = [
    { name: 'overall', min: 1, max: 99 },
    { name: 'pace', min: 1, max: 99 },
    { name: 'shooting', min: 1, max: 99 },
    { name: 'passing', min: 1, max: 99 },
    { name: 'dribbling', min: 1, max: 99 },
    { name: 'defending', min: 1, max: 99 },
    { name: 'physical', min: 1, max: 99 },
    { name: 'age', min: 15, max: 50 },
    { name: 'weakFoot', min: 1, max: 5 },
    { name: 'skillMoves', min: 1, max: 5 }
  ];

  numericFields.forEach((field) => {
    const val = Number(body[field.name]);
    if (body[field.name] === undefined || body[field.name] === null || isNaN(val)) {
      errors[field.name] = `${field.name} is required and must be a number`;
    } else if (val < field.min || val > field.max) {
      errors[field.name] = `${field.name} must be between ${field.min} and ${field.max}`;
    }
  });

  if (body.preferredFoot && !['Left', 'Right'].includes(body.preferredFoot)) {
    errors.preferredFoot = 'Preferred foot must be Left or Right';
  }

  if (body.gender && !['Male', 'Female'].includes(body.gender)) {
    errors.gender = 'Gender must be Male or Female';
  }

  if (body.playstyles && !Array.isArray(body.playstyles)) {
    errors.playstyles = 'Playstyles must be an array of strings';
  }

  const hasErrors = Object.keys(errors).length > 0;
  return {
    error: hasErrors ? errors : null,
    value: hasErrors ? null : {
      name: body.name?.trim(),
      overall: Number(body.overall),
      pace: Number(body.pace),
      shooting: Number(body.shooting),
      passing: Number(body.passing),
      dribbling: Number(body.dribbling),
      defending: Number(body.defending),
      physical: Number(body.physical),
      team: body.team?.trim(),
      league: body.league?.trim(),
      nation: body.nation?.trim(),
      position: body.position?.trim().toUpperCase(),
      age: Number(body.age),
      playstyles: Array.isArray(body.playstyles) ? body.playstyles.map(p => String(p).trim()) : [],
      weakFoot: Number(body.weakFoot),
      skillMoves: Number(body.skillMoves),
      preferredFoot: body.preferredFoot,
      gender: body.gender || 'Male',
      rank: body.rank ? Number(body.rank) : null
    }
  };
};

export const updatePlayerValidator = (body) => {
  const errors = {};

  const stringFields = ['name', 'team', 'league', 'nation', 'position', 'preferredFoot', 'gender'];
  stringFields.forEach((field) => {
    if (body[field] !== undefined && (typeof body[field] !== 'string' || body[field].trim() === '')) {
      errors[field] = `${field} must be a non-empty string`;
    }
  });

  const numericFields = [
    { name: 'overall', min: 1, max: 99 },
    { name: 'pace', min: 1, max: 99 },
    { name: 'shooting', min: 1, max: 99 },
    { name: 'passing', min: 1, max: 99 },
    { name: 'dribbling', min: 1, max: 99 },
    { name: 'defending', min: 1, max: 99 },
    { name: 'physical', min: 1, max: 99 },
    { name: 'age', min: 15, max: 50 },
    { name: 'weakFoot', min: 1, max: 5 },
    { name: 'skillMoves', min: 1, max: 5 },
    { name: 'rank', min: 1, max: 10000 }
  ];

  numericFields.forEach((field) => {
    if (body[field.name] !== undefined) {
      const val = Number(body[field.name]);
      if (isNaN(val)) {
        errors[field.name] = `${field.name} must be a number`;
      } else if (val < field.min || val > field.max) {
        errors[field.name] = `${field.name} must be between ${field.min} and ${field.max}`;
      }
    }
  });

  if (body.preferredFoot && !['Left', 'Right'].includes(body.preferredFoot)) {
    errors.preferredFoot = 'Preferred foot must be Left or Right';
  }

  if (body.gender && !['Male', 'Female'].includes(body.gender)) {
    errors.gender = 'Gender must be Male or Female';
  }

  if (body.playstyles && !Array.isArray(body.playstyles)) {
    errors.playstyles = 'Playstyles must be an array of strings';
  }

  const hasErrors = Object.keys(errors).length > 0;

  const value = {};
  if (!hasErrors) {
    const fields = [
      'name', 'overall', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 
      'physical', 'team', 'league', 'nation', 'position', 'age', 'weakFoot', 
      'skillMoves', 'preferredFoot', 'gender', 'rank'
    ];
    fields.forEach((f) => {
      if (body[f] !== undefined) {
        if (['name', 'team', 'league', 'nation', 'preferredFoot', 'gender'].includes(f)) {
          value[f] = body[f].trim();
        } else if (f === 'position') {
          value[f] = body[f].trim().toUpperCase();
        } else {
          value[f] = Number(body[f]);
        }
      }
    });
    if (body.playstyles !== undefined) {
      value.playstyles = body.playstyles.map(p => String(p).trim());
    }
  }

  return {
    error: hasErrors ? errors : null,
    value: hasErrors ? null : value
  };
};
