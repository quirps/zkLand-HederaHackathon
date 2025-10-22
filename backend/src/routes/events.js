import { Router } from 'express';
import * as eventModel from '../models/eventModel.js';

const router = Router();

// GET /events
router.get('/', async (req, res, next) => {
  try {
    // Fetches the pre-seeded mock events from the DB
    const events = await eventModel.findAll();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

export default router;