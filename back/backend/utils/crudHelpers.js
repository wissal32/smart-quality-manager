const AppError = require('./AppError');

const filterDefinedValues = (data, allowedFields = []) => {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);

  if (allowedFields.length === 0) {
    return Object.fromEntries(entries);
  }

  return Object.fromEntries(entries.filter(([key]) => allowedFields.includes(key)));
};

const buildInsertQuery = (tableName, data, returningColumns = '*') => {
  const filteredData = filterDefinedValues(data);
  const columns = Object.keys(filteredData);

  if (columns.length === 0) {
    throw new AppError('No data provided', 400);
  }

  const values = Object.values(filteredData);
  const placeholders = columns.map((_, index) => `$${index + 1}`);

  return {
    text: `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING ${returningColumns}`,
    values,
  };
};

const buildUpdateQuery = (tableName, id, data, allowedFields, returningColumns = '*') => {
  const filteredData = filterDefinedValues(data, allowedFields);
  const columns = Object.keys(filteredData);

  if (columns.length === 0) {
    throw new AppError('No updatable fields provided', 400);
  }

  const values = Object.values(filteredData);
  const setClauses = columns.map((column, index) => `${column} = $${index + 1}`);

  values.push(id);

  return {
    text: `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE id = $${columns.length + 1} RETURNING ${returningColumns}`,
    values,
  };
};

module.exports = {
  filterDefinedValues,
  buildInsertQuery,
  buildUpdateQuery,
};