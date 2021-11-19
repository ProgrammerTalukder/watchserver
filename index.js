const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://talukdertravels:${process.env.DB_PASS}@cluster0.mugj8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectId;
console.log(uri)
async function run(){
    try {
        await client.connect();
        console.log('database connected successfully')
        const database = client.db('watch-gallery');
        const watchCollection = database.collection('watches');
        const orderCollection = database.collection('order');
        const cartCollection = database.collection('cart');
        const userCollection = database.collection('users');
        const reviewCollection = database.collection('reviews');
        app.get('/watches',async (req, res)=>{
            const cursor = watchCollection.find({});
            const products = await cursor.toArray();
            console.log(products)
            res.send(products);
        });
        app.get('/order',async (req, res)=>{
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            console.log(order)
            res.send(order);
        });
        app.get('/reviews/:key',async (req, res)=>{
            const key = req.params.key
            console.log(key)
            const query = {key: key}
            const cursor = reviewCollection.find(query);
            const order = await cursor.toArray();
            console.log(order)
            res.send(order);
        });
        app.get('/reviews',async (req, res)=>{
            const cursor = reviewCollection.find({});
            const order = await cursor.toArray();
            console.log(order)
            res.send(order);
        });
        app.get('/user',async (req, res)=>{
            const email = req.query.email
            console.log(email)
            const query = {email: email}
            const cursor = userCollection.find(query);
            const user = await cursor.toArray();
            res.send(user[0])
        });
        app.get('/admin/user',async (req, res)=>{
            const cursor = userCollection.find({});
            const user = await cursor.toArray();
            res.send(user)
        });
        app.get('/watches/key',async(req, res)=>{
            const key = req.query.key;
            const query = {key: key}
            const cursor = watchCollection.find(query);
            const product = await cursor.toArray();
            res.send(product[0]);
        })
        app.get('/cart/user',async(req, res)=>{
            const email=req.query.user;
            console.log(email)
            const query = {email: email}
            console.log(query)
            const cursor = cartCollection.find(query);
            const cart = await cursor.toArray();
            res.send(cart);
        })
        app.get('/order/user',async(req, res)=>{
            const email=req.query.user;
            console.log(email)
            const query = {user: email};
            console.log(query)
            const cursor = orderCollection.find(query);
            console.log(cursor);
            const order = await cursor.toArray();
            res.send(order);
        })
        app.post('/cart', async(req, res)=>{
            console.log(req.body)
            const cart = req.body
            const result = await cartCollection.insertOne(cart)
            res.send(result)
        })
        app.post('/reviews', async(req, res)=>{
            console.log(req.body)
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })
        app.post('/watches',async (req, res)=>{
            console.log(req.body)
            const watch = req.body
            const result = await watchCollection.insertOne(watch)
            res.send(result)
        });
        app.post('/order', async(req, res)=>{
            console.log(req.body)
            const cart = req.body
            const result = await orderCollection.insertOne(cart)
            res.send(result)
        })
        app.post('/user', async(req, res)=>{
            console.log(req.body)
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.delete('/cart/:id', async (req, res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await cartCollection.deleteOne(query)
            console.log("deleting scart deleted", id)
            res.json(result)
        })
        app.delete('/order/product', async (req, res)=>{
            const key = req.query.product;
            console.log(key)
            const user = req.query.user;
            console.log(user)
            const query = {key : key, user : user}
            const result = await orderCollection.deleteMany( query )
            console.log("deleting cart deleted", key)
            res.json(result)
        })
        app.delete('/watches/product', async (req, res)=>{
            const id = req.query.id;
            console.log(id)
            const query = {_id: ObjectId(id)}
            const result = await watchCollection.deleteOne( query )
            console.log("deleting carts deleted", id)
            res.json(result)
        })
        app.delete('/user/delete', async (req, res)=>{
            const id = req.query.id;
            console.log(id)
            const query = {_id: ObjectId(id)}
            const result = await userCollection.deleteOne( query )
            console.log("deleting user deleted", id)
            res.json(result)
        })
        app.delete('/order/id', async (req, res)=>{
            const id = req.query.id;
            console.log(id)
            const query = {_id: ObjectId(id)}
            const result = await orderCollection.deleteOne( query )
            console.log("deleting order deleted", id)
            res.json(result)
        })
        app.patch('/order/id', async (req, res)=>{
            const id = req.query.id;
            console.log(id)
            const updateDoc = {
                $set: {
                  status: 'shipped',
                },
              };
            console.log(id,'geting request')
            const filter = {_id: ObjectId(id)}
            const result = await orderCollection.updateOne( filter, updateDoc )
            res.send(result)
        })
        app.patch('/user/admin', async (req, res)=>{
            const id = req.query.id;
            const updateDoc = {
                $set: {
                  role: 'admin',
                },
              };
            const filter = {_id: ObjectId(id)}
            const result = await userCollection.updateOne( filter, updateDoc )
            res.send(result)
        })
        app.patch('/user/user', async (req, res)=>{
            const id = req.query.id;
            const updateDoc = {
                $set: {
                  role: 'user',
                },
              };
            console.log(id)
            const filter = {_id: ObjectId(id)}
            const result = await userCollection.updateOne( filter, updateDoc )
            res.send(result)
        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)
app.get('/', (req, res) =>{
    res.send('running server');});
app.listen(port, () => {
    console.log('Server running port', port);
})