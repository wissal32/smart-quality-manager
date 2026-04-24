const AppError = require('./AppError');

const requireFields = (payload, fields) => {
  const missingFields = fields.filter(
    (field) => payload[field] === undefined || payload[field] === null || payload[field] === '',
  );

  if (missingFields.length > 0) {
    throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }
};

const ensureAllowedValue = (value, allowedValues, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return;
  }

  if (!allowedValues.includes(value)) {
    throw new AppError(`Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`, 400);
  }
};

module.exports = {
  requireFields,
  ensureAllowedValue,
};