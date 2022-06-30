const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




// const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DB_PASS}@cluster0.d4joq.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4joq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function todo() {
  try {
    await client.connect();
    console.log('server is connected');

    const todoCollection = client.db('todoApp').collection('todos');

    app.post('/todo', async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });


  }
  finally { }
}

todo().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello from Todo')
})

app.listen(port, () => {
  console.log('todo server is running ');
})