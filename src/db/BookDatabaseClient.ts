import { MongoClient } from 'mongodb';

interface Book {
  title: string;
  author: string;
  notes: string;
};

class BookDatabaseClient {
  private client: any;
  private collection: any;
  private count: number = 0;
  
  public constructor(private uri: string) { }

  public async connect(dbName: string, collectionName: string): Promise<void> {
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await this.client.connect();
    this.collection = this.client.db(dbName).collection(collectionName);
    return this.collection;
  }

  public async close() {
    if (this.client) {
      await this.client.close();
      this.client = undefined;
      this.collection = undefined;
      console.log('Closed the database client');
    }
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

  public async getOneItem(
    query: { title?: string, author?: string, notes?: string}): 
    Promise<any> {

    if (!this.collection) throw new Error('collection is not defined');
    let result = await this.collection.findOne(query);

    if (result === null) {
      console.log('No results found');
      return { error: 'No results found'};
    }

    return result;
  }

  public async insertItem(doc: Book): Promise<Book | { error: string }> {
    if (!this.collection) throw new Error('collection is not defined');

    const { result, ops } = await this.collection.insertOne({ _id: this.count + 1, ...doc });
    if (result.ok === 1) {
      console.log('document inserted successfully');
      this.count += 1;
    } else {
      throw Error('could not insert document');
    }

    return ops[0];
  }

  public async deleteOneItem(query: {title?: string, author?: string}): Promise<Book | { error: string }> {
    if (!this.collection) throw new Error('collection is not defined');
    const { value } = await this.collection.findOneAndDelete(query);
    
    if (value === null) {
      console.log('no document found');
      return { error: 'No document found' };
    }

    this.count -= 1;
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