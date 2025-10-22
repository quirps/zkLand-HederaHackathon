import pool from '../db/connect.js';

export const findAll = async () => {
  const res = await pool.query('SELECT * FROM authorities ORDER BY created_at DESC');
  return res.rows;
};

export const create = async ({ name, title, pubkey, jurisdiction }) => {
  const res = await pool.query(
    'INSERT INTO authorities (name, title, pubkey, jurisdiction) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, title, pubkey, jurisdiction]
  );
  return res.rows[0];
};