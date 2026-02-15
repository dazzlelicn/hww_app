export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const isPositiveInt = (value) => Number.isInteger(value) && value > 0;
