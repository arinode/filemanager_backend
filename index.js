import express from 'express';

const app = express();

app.get('/', (_req, res, _next) => {
  res.send('Working');
});

console.log('Server is listening on port 25401');
app.listen(25401);
