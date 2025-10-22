import pool from '../db/connect.js';

export const findAll = async () => {
  const res = await pool.query('SELECT * FROM events ORDER BY timestamp DESC');
  return res.rows;
};