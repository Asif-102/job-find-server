const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('dotenv').config()

const port = process.env.PORT || 4000;

const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const db = process.env.DB_NAME;

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const uri = `mongodb+srv://${user}:${password}@cluster0.wp8tr.mongodb.net/${db}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




client.connect(err => {

    const employersAccount = client.db(db).collection("employerAccount");
    const adminAccount = client.db(db).collection("adminAccount");

    app.get('/', (req, res) => {
        res.send('This is MERN Stack task');
    })

    app.post('/addEmployer', (req, res) => {
        const account = req.body;
        employersAccount.insertOne(account)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/findEmployer', (req, res) => {
        const email = req.query.email;
        employersAccount.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/findAdmin', (req, res) => {
        const email = req.query.email;
        adminAccount.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


});




app.listen(port, () => console.log(`Listenting to port at ${port}`));