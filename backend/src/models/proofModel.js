import pool from '../db/connect.js';

// Optional: Log proof requests
export const create = async ({ schemaId, authorityId, proof, status }) => {
  const res = await pool.query(
    'INSERT INTO proof_requests (schema_id, authority_id, proof, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [schemaId, authorityId, proof, status]
  );
  return res.rows[0];
};