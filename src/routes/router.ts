import * as express from 'express';
import dbConfig from '../db/dbConfig';
import BookDatabaseClient from '../db/BookDatabaseClient';

const { URI, DB, COLLECTION } = dbConfig;
const router = express.Router();
const dbClient = new BookDatabaseClient(URI);

router.get('/books', async (req, res) => {
  // TODO: Check for query parameters here

  if (req.query) {
    await dbClient.connect(DB, COLLECTION);
    const item = await dbClient.getOneItem(req.query);
    res.send(item);
  } else {
    await dbClient.connect(DB, COLLECTION);
    const items = await dbClient.getAllItems();
    res.send(items);
  }

  await dbClient.close();
});

router.post('/books', (req, res) => {
  res.send('Create book');
});

router.delete('/books', (req, res) => {
  res.send('Delete a book');
});

router.put('/books', (req, res) => {
  res.send('Update a book');
});

export default router;