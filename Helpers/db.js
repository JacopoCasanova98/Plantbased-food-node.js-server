const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    if (!Database.instance) {
      this.client = new MongoClient('mongodb://localhost:27017', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      Database.instance = this;
    }
    return Database.instance;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db('plantbasedfood');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
    }
  }
}

const instance = new Database();

module.exports = instance;
