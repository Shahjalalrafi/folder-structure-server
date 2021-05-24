const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
const port = 5050



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fltsf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
    res.send('hello world')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const folderCollection = client.db("FolderStructure").collection("Folder");

    app.post('/addFolder', (req, res) => {
        const folderName = req.body

        folderCollection.insertOne(folderName)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/folder', (req, res) => {
        folderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/folderDelete/:id', (req, res) => {
        console.log(req.params.id)
        folderCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

});




app.listen(port, () => {
    console.log('i am listening from port 5050')
})