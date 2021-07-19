// CRUD create read update delete
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const id = new ObjectID()
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)

    db.collection('tasks').findOne({ _id: new ObjectID('60f371a3c56f0513f507c2c3') }, (error, task) => console.log(error ? error : task))
    db.collection('tasks').find({ completed: false }).toArray((error, tasks) => console.log(error ? error : tasks))

})