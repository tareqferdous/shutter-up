const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId =  require('mongodb').ObjectId
require('dotenv').config()


const app = express()
const port = 4000

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello Shutter Up Server!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnprp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("shutterUp").collection("events");
  const orderCollection = client.db("shutterUp").collection("orders");
  const adminCollection = client.db("shutterUp").collection("admin");

    app.post('/addService', (req, res) => {
      const newService = req.body;
      console.log('adding a new service', newService);
      serviceCollection.insertOne(newService)
      .then(result => {
        console.log('inserted count', result);
        res.send(result.insertedCount > 0);
      })
    });

    app.get('/serviceList', (req, res) => {
      serviceCollection.find()
      .toArray((err, result) => {
        console.log(err);
        console.log(result);
        res.send(result);
      })
    });

    app.get('/serviceList/:id', (req, res) => {
      const serviceId = req.params.id
      serviceCollection.find({_id:ObjectId(serviceId)})
      .toArray((err, result) => {
        console.log(result)
        res.send(result);
      })
    });

    app.delete('/delete/:id', (req, res) =>{
      const serviceId = req.params.id
      serviceCollection.deleteOne({_id:ObjectId(serviceId)})
      .then(response => {
        console.log(response)
        res.send(response.deletedCount > 0)
      })
    });

    app.post('/placeOrder', (req, res) => {
      const info = req.body;
      orderCollection.insertOne(info)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
      })
    });

    app.get('/orderList', (req, res) => {
      orderCollection.find()
      .toArray((err, result) => {
        console.log(err);
        console.log(result);
        res.send(result);
      })
    });

    app.get('/orderList/:id', (req, res) => {
      const serviceId = req.params.id
      orderCollection.find({_id:ObjectId(serviceId)})
      .toArray((err, result) => {
        console.log(err);
        console.log(result);
        res.send(result);
      })
    });

    app.patch('/update/:id', (req, res)=> {
      const id = req.params.id
       const newInfo = req.body;
       orderCollection.findOneAndUpdate(
         {_id: ObjectId(id)},
         {$set: {status: newInfo.status}}
       )
       .then(result => {
         console.log(result);
       })
    });

    app.post('/addAdmin', (req, res) => {
      const admin = req.body;
      adminCollection.insertOne(admin)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
      })
    });

    app.get('/getAdmin', (req, res) => {
      adminCollection.find()
      .toArray((err, result)=> {
        console.log(err);
        res.send(result)
      })
    });


});


app.listen(process.env.PORT || port)