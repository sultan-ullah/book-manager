import { MongoClient, Collection, Cursor, ObjectID } from 'mongodb';

interface Book {
  title: string;
  author: string;
  notes?: string;
}

class BookDatabaseClient {
  private client: MongoClient;

  private collection: Collection;

  private uri: string;

  public constructor(uri: string) {
    this.uri = uri;
  }

  public async connect(dName: string, cName: string): Promise<Collection> {
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await this.client.connect();
    this.collection = this.client.db(dName).collection(cName);
    
    return this.collection;
  }

  public async close() {
    if (this.client) {
      await this.client.close();
      this.client = undefined;
      this.collection = undefined;
      
      console.log('Closed the database client');
    } else {
      console.log('Client is not defined');
      return;
    }
  }

  public async getAllItems() {
    return new Promise<Book[]>((resolve, reject) => {
      if (!this.collection) reject({ error: 'Collection is not defined' });
      
      const cursor: Cursor = this.collection.find({});
      const items: Book[] = [];

      cursor.on('data', (data) => items.push(data));
      cursor.on('end', () => resolve(items));
    });
  }

  public async getOneItem(id: string): Promise <Book> {
    if (!this.collection) throw { error: 'Collection is not defined' };

    const result: Book = await this.collection.findOne({ "_id": new ObjectID(id) });

    if (result === null) throw { error: 'No results found' };

    return result;
  }

  public async insertItem(bookToInsert: Book): Promise<Book> {
    if (!this.collection) throw { error: 'Collection is not defined'};

    if (!bookToInsert.notes) bookToInsert.notes = "";

    const { result, ops } = await this.collection.insertOne(bookToInsert);
    
    if (result.ok === 1) {
      console.log('Document inserted successfully');
    } else {
      throw { error: 'Could not insert book'};
    }

    return ops[0];
  }

  public async deleteOneItem( id: string ): Promise<Book> {
    if (!this.collection) throw { error: 'Collection is not defined'};

    const { value } = await this.collection.findOneAndDelete({ "_id": new ObjectID(id) });

    if (value === null) {
      console.log('No document found');
      throw { error: 'No document found' };
    }

    return value;
  }

  public async updateOneItem( id: string, updateValues: {title?: string, author?: string, notes?: string}) {
    if (!this.collection) throw { error: 'Collection is not defined'};
    const { value } = await this.collection.findOneAndUpdate({ "_id": new ObjectID(id) }, { $set: updateValues });
    
    if (value === null) {
      console.log('No document found');
      throw { error: 'No document found'};
    }

    return value;
  }
}

export default BookDatabaseClient;
