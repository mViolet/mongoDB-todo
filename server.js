const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000

require('dotenv').config() //for the env variable

let db,   //eventually holds db
    dbConnectionStr = process.env.MONGO_STR,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => console.log(err))
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    db.collection('todos').find().toArray()
    .then(data => {
        // console.log(data)
        res.render('index.ejs', {arrayOfItems: data})
    })
    .catch(err => console.log(err))
})

app.post('/createTodo', (req, res) => {
    const item = req.body.todoItem.trim() //doing this to prevent spaces at the ends of items submitted
    db.collection('todos').countDocuments({ todo: item }, { limit: 1 })
        .then(result => {
            if (!result) { //check if num is 0. if it's 1, it's in the db. if it's 0, it's not
                db.collection('todos').insertOne({ todo: item, completed: false })
                .then(result => {
                    console.log('Todo item has been added')
                    res.redirect('/')
                })
            } else {
                console.log(`"${item}" already exists in the database`)
                res.redirect('/')
            }
        }).catch(err => console.log(err))
})

app.delete('/deleteTodo', (req, res) => {
    db.collection('todos').deleteOne({todo:req.body.clickedText}) // go to database, find collection 'todos', 
    .then(result => { //when promise resolves, fire then with an argument that is the result
        console.log(req.body.deletedThisItem)
        console.log('deleted Todo item')
        res.json('Deleted it...') //send back to fetch
    })
    .catch(err => console.log(err))
})

app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.itemToMark}, {
        $set: {
            completed: true
        }
    })
    .then(result => {
        console.log('marked complete')
        res.json('Marked complete')
    })
})

app.listen(PORT, () => {
    console.log(`Server is running, you better catch it`)
})