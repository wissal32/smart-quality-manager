const { query } = require('../config/db');
const { buildInsertQuery, buildUpdateQuery } = require('../utils/crudHelpers');

const tableName = 'users';
const publicColumns = 'id, name, email, role, department, created_at';
const allColumns = 'id, name, email, password, role, department, created_at';
const updatableFields = ['name', 'email', 'password', 'role', 'department'];

const create = async (userData) => {
  const { text, values } = buildInsertQuery(tableName, userData, publicColumns);
  const result = await query(text, values);
  return result.rows[0];
};

const findAll = async () => {
  const result = await query(`SELECT ${publicColumns} FROM ${tableName} ORDER BY created_at DESC`);
  return result.rows;
};

const findById = async (id) => {
  const result = await query(`SELECT ${publicColumns} FROM ${tableName} WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

const findByIdWithPassword = async (id) => {
  const result = await query(`SELECT ${allColumns} FROM ${tableName} WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

const findByEmail = async (email) => {
  const result = await query(`SELECT ${allColumns} FROM ${tableName} WHERE email = $1`, [email]);
  return result.rows[0] || null;
};

const update = async (id, userData) => {
  const { text, values } = buildUpdateQuery(tableName, id, userData, updatableFields, publicColumns);
  const result = await query(text, values);
  return result.rows[0] || null;
};

const remove = async (id) => {
  const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING ${publicColumns}`, [id]);
  return result.rows[0] || null;
};

module.exports = {
  create,
  findAll,
  findById,
  findByIdWithPassword,
  findByEmail,
  update,
  remove,
};