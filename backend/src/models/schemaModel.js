import pool from '../db/connect.js';

export const findAll = async () => {
  const res = await pool.query('SELECT * FROM schemas ORDER BY created_at DESC');
  return res.rows;
};

export const findById = async (id) => {
  const res = await pool.query('SELECT * FROM schemas WHERE id = $1', [id]);
  return res.rows[0];
};

export const create = async ({ name, description, json_schema }) => {
  const res = await pool.query(
    'INSERT INTO schemas (name, description, json_schema) VALUES ($1, $2, $3) RETURNING *',
    [name, description, json_schema]
  );
  return res.rows[0];
};