const getPaginationData = (totalItems, page, limit) => {
  const currentPage = parseInt(page, 10) || 1;
  const currentLimit = parseInt(limit, 10) || 10;
  const totalPages = Math.ceil(totalItems / currentLimit);

  return {
    totalItems,
    totalPages,
    currentPage,
    limit: currentLimit,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export default getPaginationData;
