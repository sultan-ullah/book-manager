import dbConfig from './db/dbConfig';
import BookDatabaseClient from './db/BookDatabaseClient';
import * as express from 'express';

(async () => {
  try {
    const app = express();
    const port = 3000;
    const router = express.Router();

    router.get('/books', function (req, res) {
      res.send('All books')
    })

    router.get('/books/:id', function (req, res) {
      res.send('One book')
    })

    router.post('/books', function (req, res) {
      res.send('Create book');
    })

    router.delete('/books/:id', function (req, res) {
      res.send('Delete a book');
    })

    router.put('/books/:id', function (req, res) {
      res.send('Update a book');
    })

    app.use(router);
    app.listen(port, () => console.log(`Express is listening on port: ${port}`))
    
  } catch (error) {
    console.log(error);
  }
})();
