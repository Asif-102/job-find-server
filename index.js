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
    const employerPost = client.db(db).collection("employerPost");
    const approvedJobs = client.db(db).collection("approvedJobs");

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

    app.get('/postedJob', (req, res) => {
        employerPost.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/findEmployer', (req, res) => {
        const email = req.query.email;
        employerPost.find({email:email})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/jobPost', (req, res) => {
        const job = req.body;
        employerPost.insertOne(job)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.patch('/updateStatus', (req, res) => {
        const id = req.body.id;
        console.log(req.body);
        employerPost.updateOne({ _id: ObjectId(id) },
            {
                $set: { status: req.body.status }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })


    app.post('/approvedJobs', (req, res) => {
        const job = req.body;
        console.log(req.body);
        approvedJobs.insertOne(job)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })

    app.get('/publishedJobs', (req, res) => {
        const search = req.query.search;
        approvedJobs.find({jobName: {$regex: search}})
        .toArray((err, documents)=>{
            res.send(documents);
        })
    })

    app.get('/allpublishJobs', (req, res) => {
        
        approvedJobs.find()
        .toArray((err, documents)=>{
            res.send(documents);
        })
    })


});




app.listen(port, () => console.log(`Listenting to port at ${port}`));