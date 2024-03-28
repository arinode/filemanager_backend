import express from 'express';
import entriesRouter from './entries.js';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('working api');
});

router.use('/entries', entriesRouter);

router.use((err, _req, res, _next) => {
  res.status(500).json({ error: err.message });
});

export { router };
