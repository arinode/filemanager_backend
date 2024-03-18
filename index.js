import express from 'express';
import { PORT } from './lib/index.js';
import * as api from './api/index.js';

const app = express();

app.use((_req, res, next) => {
  res.set('Content-Security-Policy', "default-src 'self'");
  next();
});

app.get('/', (_req, res, _next) => {
  res.send('Working');
});

app.use('/api', api.router);

console.log(`Server is listening on port ${PORT}`);
app.listen(PORT);
