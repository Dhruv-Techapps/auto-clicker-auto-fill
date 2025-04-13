/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

const app = express();
console.log(express.static(path.join(__dirname, 'locales')));
app.use('/locales', express.static(path.join(__dirname, 'locales')));

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/locales`);
});
server.on('error', console.error);
