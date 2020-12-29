import dbConfig from './db/dbConfig';
import BookDatabaseClient from './db/BookDatabaseClient';

(async () => {
  try {
    const { URI, DB, COLLECTION } = dbConfig;
    const dbClient = new BookDatabaseClient(URI);
    await dbClient.connect(DB, COLLECTION);
    const result = await dbClient.updateOneItem({ title: 'first book'}, {author: 'updated first author'});
    console.log(result);

    const items = await dbClient.getAllItems();
    console.log('------\n' + JSON.stringify(items, null, 2));
  } catch (error) {
    console.log(error);
  }
})();
