import { MongoClient } from 'mongodb';

interface Book {
  title: string;
  author: string;
  notes: string;
};

class BookDatabaseClient {
  private client: any;
  private collection: any;

  public constructor(uri: string) {
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  public async connect(dbName: string, collectionName: string): Promise<void> {
    if (!this.collection) {
      await this.client.connect();
      this.collection = this.client.db(dbName).collection(collectionName);
    }

    return this.collection;
  }

  public async getAllItems(): Promise<Object[]> {
    return new Promise<Object[]>((resolve, reject) => {
      if (!this.collection) reject(new Error('collection is not defined'));
      const cursor = this.collection.find({});
      const items: Object[] = [];
      cursor.on('data', data => items.push(data));
      cursor.on('end', () => resolve(items));
    })
  }

  public async getOneItem(query: {title?: string, author?: string, notes?: string}): Promise<Book | null> {
    if (!this.collection) throw new Error('collection is not defined');
    const result = await this.collection.findOne(query);
    if (result === null) console.log('no results found');
    return result;
  }

  public async insertItem(doc: Book): Promise<Book> {
    if (!this.collection) throw new Error('collection is not defined');
    const { result, ops } = await this.collection.insertOne(doc);
    if (result.ok === 1) {
      console.log('document inserted successfully');
    } else {
      throw Error('could not insert document');
    }

    return ops[0];
  }

  public async deleteOneItem(query: {title?: string, author?: string}): Promise<Book | null> {
    if (!this.collection) throw new Error('collection is not defined');
    const { value } = await this.collection.findOneAndDelete(query);
    if (value === null) console.log('no document found');
    return value;
  }

  public async updateOneItem(
    query: {title?: string, author?: string}, 
    updateValues: {title?: string, author?: string, notes?: string}): Promise<Object | null> {
    if (!this.collection) throw new Error('collection is not defined');
    const { value } = await this.collection.findOneAndUpdate(query, { $set: updateValues});
    if (value === null) console.log('no document found');
    return value;
  }
}

export default BookDatabaseClient;