import * as express from 'express';
import dbConfig from '../db/dbConfig';
import BookDatabaseClient from '../db/BookDatabaseClient';

const { URI, DB, COLLECTION } = dbConfig;
const router = express.Router();
const dbClient = new BookDatabaseClient(URI);

// -------------------------------------------

router.get('/books', async (req, res) => {
  try {
    await dbClient.connect(DB, COLLECTION);
    const items = await dbClient.getAllItems();
    await dbClient.close();
    res.send(items);
  } catch (e) {
    await dbClient.close();
    res.send(e);
  }
});

// -------------------------------------------

router.get('/books/:id', async (req, res) => {
  try {
    await dbClient.connect(DB, COLLECTION);
    const item = await dbClient.getOneItem(req.params.id);

    await dbClient.close();
    res.send(item);
  } catch (e) {
    await dbClient.close();
    res.send(e);
  }
});

// -------------------------------------------

router.post('/books', async (req, res) => {
  try {
    const { title, author, notes } = req.body;

    if (!title && !author) res.send({ error: 'Book must have atleast title and author' });

    await dbClient.connect(DB, COLLECTION);
    const toCreate = { title, author, notes };
    const item = await dbClient.insertItem(toCreate);

    await dbClient.close();
    res.send(item);
  } catch (e) {
    await dbClient.close();
    res.send(e);
  }
});

// -------------------------------------------

router.delete('/books/:id', async (req, res) => {
  try {
    await dbClient.connect(DB, COLLECTION);

    const item = await dbClient.deleteOneItem(req.params.id);
    await dbClient.close();
    res.send(item);
  } catch (e) {
    await dbClient.close();
    res.send(e);
  }
});

// -------------------------------------------

router.put('/books/:id', async (req, res) => {
  try {
    const { title, author, notes } = req.body;

    await dbClient.connect(DB, COLLECTION);

    const toUpdate: { title?: string, author?: string, notes?: string} = {};

    if (title) toUpdate.title = title;
    if (author) toUpdate.author = author;
    if (notes) toUpdate.notes = notes;

    const item = await dbClient.updateOneItem(req.params.id, toUpdate);

    await dbClient.close();
    res.send({ ...item, ...toUpdate });
  } catch (e) {
    await dbClient.close();
    res.send(e);
  }
});

export default router;
