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

    app.get('/', (req, res) => {
        res.send('This is MERN Stack task');
    })


});




app.listen(port, () => console.log(`Listenting to port at ${port}`));