// CRUD create read update delete

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name: 'Islam',
    //     age: 29,
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert user!')
    //     }

    //     console.log(result.ops)
    // })

    db.collection('tasks').insertMany([
        {
            description: 'Walk an hour before sleep',
            completed: false,
        },
        {
            description: 'Write an article',
            completed: true,
        },
        {
            description: 'Buy milk',
            completed: false,
        }
    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert tasks!')
        }
        console.log(result.ops)
    })
})