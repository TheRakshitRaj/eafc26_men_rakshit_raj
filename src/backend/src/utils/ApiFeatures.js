class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'q'];

    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle Mongoose numeric comparisons like overall[gte]=85 -> {overall: {$gte: 85}}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|in|nin|all|regex|options)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);

    // Convert values that look like numbers to actual numbers so Mongoose queries them correctly
    Object.keys(parsedQuery).forEach((key) => {
      if (typeof parsedQuery[key] === 'object' && parsedQuery[key] !== null) {
        Object.keys(parsedQuery[key]).forEach((subKey) => {
          const val = parsedQuery[key][subKey];
          if (!isNaN(val) && val !== '') {
            parsedQuery[key][subKey] = Number(val);
          }
        });
      } else if (!isNaN(parsedQuery[key]) && parsedQuery[key] !== '') {
        parsedQuery[key] = Number(parsedQuery[key]);
      }
    });

    // Enforce soft delete check (only get non-deleted documents)
    parsedQuery.isDeleted = { $ne: true };

    this.query = this.query.find(parsedQuery);
    return this;
  }

  search(searchFields = ['name']) {
    if (this.queryStr.q) {
      const searchPattern = new RegExp(this.queryStr.q, 'i');
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: searchPattern }
      }));
      
      // Merge with existing finds if any, or create one
      this.query = this.query.find({ $or: searchQueries });
    }
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      // Allow custom alias translation like sort=ovr -> overall, sort=pace -> pace
      let sortBy = this.queryStr.sort.split(',').map(term => {
        if (term === 'ovr') return 'overall';
        if (term === '-ovr') return '-overall';
        return term;
      }).join(' ');
      
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-overall'); // default sorting by highest overall player
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // default exclude mongoose version flag
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
