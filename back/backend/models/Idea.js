const { query } = require('../config/db');
const { buildInsertQuery, buildUpdateQuery } = require('../utils/crudHelpers');

const tableName = 'ideas';
const columns = 'id, title, description, votes, status, created_by, created_at';
const updatableFields = ['title', 'description', 'votes', 'status', 'created_by'];

const create = async (ideaData) => {
  const { text, values } = buildInsertQuery(tableName, ideaData, columns);
  const result = await query(text, values);
  return result.rows[0];
};

const findAll = async () => {
  const result = await query(`SELECT ${columns} FROM ${tableName} ORDER BY created_at DESC`);
  return result.rows;
};

const findById = async (id) => {
  const result = await query(`SELECT ${columns} FROM ${tableName} WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

const update = async (id, ideaData) => {
  const { text, values } = buildUpdateQuery(tableName, id, ideaData, updatableFields, columns);
  const result = await query(text, values);
  return result.rows[0] || null;
};

const remove = async (id) => {
  const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING ${columns}`, [id]);
  return result.rows[0] || null;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
};