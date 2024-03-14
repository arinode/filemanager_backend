import express from 'express';
import { PORT } from './lib/index.js';

const app = express();

app.get('/', (_req, res, _next) => {
  res.send('Working');
});

console.log(`Server is listening on port ${PORT}`);
app.listen(PORT);
