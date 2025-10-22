import { Router } from 'express';
import * as authorityModel from '../models/authorityModel.js';

const router = Router();

// GET /authorities
router.get('/', async (req, res, next) => {
  try {
    const authorities = await authorityModel.findAll();
    res.json(authorities);
  } catch (err) {
    next(err);
  }
});

// POST /authorities
router.post('/', async (req, res, next) => {
  try {
    const { name, title, pubkey, jurisdiction } = req.body;
    if (!name || !pubkey) {
      return res.status(400).json({ message: 'Name and pubkey are required' });
    }
    const newAuthority = await authorityModel.create({ name, title, pubkey, jurisdiction });
    res.status(201).json(newAuthority);
  } catch (err) {
    next(err);
  }
});

export default router;