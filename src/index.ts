import dbConfig from './db/dbConfig';
import BookDatabaseClient from './db/BookDatabaseClient';
import * as express from 'express';

(async () => {
  try {
    const app = express()
    const port = 3000

    app.get('/', (req, res) => {
      res.send('Hello World!')
    });

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error);
  }
})();
