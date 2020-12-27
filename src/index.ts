
import * as dbConfig from './dbConfig.js';
import { MongoClient } from 'mongodb';
console.log(dbConfig);
class BookDatabaseClient {
  uri: any;
  dbName: any;
  collectionName: any;
  client: any;
  collection: any;
  constructor({uri, dbName, collectionName}) {
    this.uri = uri;
    this.dbName = dbName;
    this.collectionName = collectionName;

    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  async connect() {
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

  async getAllItems() {
    return new Promise((resolve, reject) => {
      if (this.collection) {
        const cursor = this.collection.find({});
        const items = [];
        cursor.on('data', data => items.push(data));
        cursor.on('end', () => resolve(items));
      } else {
        reject(new Error('Error: collection is not defined'));
      }
    })
  }

  async getOneItem() {
    
  }

  async insertItem() {

  }

  async deleteItem() {

  }

  async updateItem() {

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
