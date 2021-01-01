import * as express from 'express';
import dbConfig from '../db/dbConfig';
import BookDatabaseClient from '../db/BookDatabaseClient';

const { URI, DB, COLLECTION } = dbConfig;
const router = express.Router();
const dbClient = new BookDatabaseClient(URI);

router.get('/books/:id', async (req, res) => {
  await dbClient.connect(DB, COLLECTION);

  if (req.query.title && req.query.author) {
    
    const query: { title?: string, author?: string, notes?: string } = {};
    const { title, author, notes } = req.query;

    if (title) query.title = title;
    if (author) query.author = author;
    if (notes) query.notes = notes;
    
    const item = await dbClient.getOneItem(query);
    await dbClient.close();
    res.send(item);
    
  } else {

    await dbClient.connect(DB, COLLECTION);
    const items = await dbClient.getAllItems();
    await dbClient.close();
    res.send(items);

  }
});

router.post('/books', async (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) res.send({ error: 'Book must have atleast title and author'});
  
  await dbClient.connect(DB, COLLECTION);

  const toCreate: { title: string, author: string, notes: string } = { title: '', author: '', notes: ''};
  toCreate.title = title;
  toCreate.author = author;

  const item = await dbClient.insertItem(toCreate);

  await dbClient.close();
  res.send(item);
});

router.delete('/books/:id', async (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) res.send({ error: 'Book must have atleast title and author'});

  await dbClient.connect(DB, COLLECTION);

  const toDelete: { title?: string, author?: string, notes?: string} = {};
  toDelete.title = title;
  toDelete.author = author;

  const item = await dbClient.deleteOneItem(toDelete);
  res.send(item);
});

router.put('/books/:id', async (req, res) => {
  await dbClient.connect(DB, COLLECTION);

  if (req.params.title) {
    
    const title = req.params.title;
    const updated = dbClient.updateOneItem({ title }, req.body);

    res.send(updated);
  } else {
    res.send({ error: 'query must include title' });
  }
});

export default router;