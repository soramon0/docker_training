const keys = require('./keys')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')
const redis = require('redis')

// Initiate express
const app = express()

// Create redis client
const redisClient = redis.createClient({
    host: keys.redisHOST,
    port: keys.redisPort,
    retry_strategy: () => 1000
})
const redisPublisher = redisClient.duplicate()

// Initiate Postgress pool
const pgClient = new Pool({
    host: keys.pgHost,
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase,
    port: keys.pgPort
})

// Set middle ware
app.use(cors())
app.use(bodyParser.json())

// Log errors
pgClient.on('error', () => console.log('Lost PG connection'))

// Create table
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(console.log)

// Eexpress route handlers
app.get('/', (req, res) => {
    res.send('HI')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values')

    res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values)
    })
})

app.post('/values', async (req, res) => {
    const index = req.body.index
    
    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high')
    }
    
    redisClient.hset('values', index, 'Nothing yet!')
    redisPublisher.publish('insert', index)
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
   
    res.send({working: true})  
})

app.listen(5000, () => {
    console.log('Listening on 5000')
})
