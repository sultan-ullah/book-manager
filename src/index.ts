import dbConfig from './dbConfig';
import { MongoClient } from 'mongodb';
class BookDatabaseClient {
  private uri: string;
  private dbName: string;
  private collectionName: string;
  private client: any;
  private collection: any;

  public constructor({uri, dbName, collectionName}) {
    this.uri = uri;
    this.dbName = dbName;
    this.collectionName = collectionName;

    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  public async connect(): Promise<void> {
    try {
      if (!this.collection) {
        await this.client.connect();
        this.collection = this.client.db(this.dbName).collection(this.collectionName);
      }
      return this.collection;
    } catch (error) {
      console.log(error);
      throw new Error(`Error connecting to database: ${error}`);
    }
  }

  public async getAllItems(): Promise<Object[]> {
    return new Promise<Object[]>((resolve, reject) => {
      if (this.collection) {
        const cursor = this.collection.find({});
        const items: Object[] = [];
        cursor.on('data', data => items.push(data));
        cursor.on('end', () => resolve(items));
      } else {
        reject(new Error('Error: collection is not defined'));
      }
    })
  }

  public async getOneItem() {
    
  }

  public async insertItem() {

  }

  public async deleteItem() {

  }

  public async updateItem() {

  }
}

(async () => {
  try {
    const {URI, DB, COLLECTION, PASSWORD} = dbConfig;
    const dbClient = new BookDatabaseClient({ uri: URI, dbName: DB, collectionName: COLLECTION});
    await dbClient.connect();
    const items = await dbClient.getAllItems();
    console.log(items);
  } catch (error) {
    console.log(error);
  }
})();
