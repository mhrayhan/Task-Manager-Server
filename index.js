const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());




// const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DB_PASS}@cluster0.d4joq.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4joq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function todo() {
  try {
    await client.connect();
    console.log('server is connected');

    const todoCollection = client.db('todoApp').collection('todos');
    const completeCollection = client.db('todoApp').collection('completed');





    // edit/update todo
    app.put('/todo/:id', async (req, res) => {
      const id = req.params.id;
      const updateTodo = req.body;
      console.log(updateTodo);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          todo: updateTodo.todo
        }
      }
      const result = await todoCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    // get single todo data API
    app.get('/todo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const todo = await todoCollection.findOne(query);
      res.send(todo);
    });

    // get todo data API
    app.get('/todo', async (req, res) => {
      const todo = await todoCollection.find().toArray();
      res.send(todo);
    });

    // todo add database API
    app.post('/todo', async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });

    // get completed todo data API
    app.get('/completed', async (req, res) => {
      const completedTodo = await completeCollection.find().toArray();
      res.send(completedTodo);
    });

    // completed add database API
    app.post('/completed', async (req, res) => {
      const todo = req.body;
      const result = await completeCollection.insertOne(todo);
      res.send(result);
    });
    // get single CompletedTodo data API
    // app.get('/completed/:id', async (req, res) => {
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = { _id: ObjectId(id) };
    //   const result = await completeCollection.findOne(query);
    //   res.send(result);
    // });
    app.get('/completed/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await completeCollection.findOne(query)
      res.send(result)
    })

    // delete todo api
    app.delete('/todo/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(filter);
      res.send(result);
    })
    // delete completed todo api
    app.delete('/completed/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await completeCollection.deleteOne(filter);
      console.log(result);
      res.send(result);
    })


  }
  finally { }
}
todo().catch(console.dir);

async function lpg() {
  try {
    await client.connect();
    const lpgPriceCollection = client.db('lpg').collection('price');


    app.post('/price', async (req, res) => {
      const price = req.body;
      const result = await lpgPriceCollection.insertOne(price);
      res.send(result);
    });

    app.get('/price', async (req, res) => {
      const priceList = await lpgPriceCollection.find().toArray();
      res.send(priceList);
    });

    app.put('/price/:id', async (req, res) => {
      const id = req.params.id;
      const updatePrice = req.body;
      console.log(id, updatePrice);
      const filter = { _id: id };
      const options = { upsert: true };
      const updatedDoc = {
        $set: updatePrice
      }
      const result = await lpgPriceCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    app.get('/price/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id }
      const result = await lpgPriceCollection.findOne(query);
      res.send(result);
    });


  }
  finally { }
}
lpg().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello from Todo')
})

app.listen(port, () => {
  console.log('todo server is running ');
})