const { query } = require('../config/db');
const { buildInsertQuery, buildUpdateQuery } = require('../utils/crudHelpers');

const tableName = 'equipment';
const columns = 'id, name, type, serial_number, qr_code, status, last_maintenance, created_at';
const updatableFields = ['name', 'type', 'serial_number', 'qr_code', 'status', 'last_maintenance'];

const create = async (equipmentData) => {
  const { text, values } = buildInsertQuery(tableName, equipmentData, columns);
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

const update = async (id, equipmentData) => {
  const { text, values } = buildUpdateQuery(tableName, id, equipmentData, updatableFields, columns);
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