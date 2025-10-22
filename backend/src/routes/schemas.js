import { Router } from 'express';
import * as schemaModel from '../models/schemaModel.js';

const router = Router();

// GET /schemas
router.get('/', async (req, res, next) => {
  try {
    const schemas = await schemaModel.findAll();
    res.json(schemas);
  } catch (err) {
    next(err);
  }
});

// GET /schemas/:id
router.get('/:id', async (req, res, next) => {
  try {
    const schema = await schemaModel.findById(req.params.id);
    if (!schema) {
      return res.status(404).json({ message: 'Schema not found' });
    }
    res.json(schema);
  } catch (err) {
    next(err);
  }
});

// POST /schemas
router.post('/', async (req, res, next) => {
  try {
    const { name, description, json_schema } = req.body;
    if (!name || !json_schema) {
      return res.status(400).json({ message: 'Name and json_schema are required' });
    }
    const newSchema = await schemaModel.create({ name, description, json_schema });
    res.status(201).json(newSchema);
  } catch (err) {
    next(err);
  }
});

export default router;