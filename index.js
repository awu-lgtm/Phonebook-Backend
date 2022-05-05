const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
var split = require('split')
const { c } = require('tar')
const app = express()
const PORT = process.env.PORT || 3001

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,
    optionSuccessStatus:200
}

app.use(cors(corsOptions))

app.use(express.static('build'))
app.use(express.json())

morgan.token('content', (request, response) => JSON.stringify(request.body))

stream = split().on('data', (line) => process.stdout.write(line))

app.use(morgan('tiny', { stream: stream }))

let persons = 
    [{
        id: 1,
        name: "Arto Hellas",
        num: "040-123456"
    }, 
    {
        id: 2,
        name: "Ada Lovelace",
        num: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        num: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        num: "39-23-6423122"
    }]

const message = `Phonebook has info for ${persons.length} <br/><br/> ${new Date()}`

app.get('/api/persons', (request, response) => {response.json(persons)})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id == id)
    console.log('asdf')
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => response.send(message))

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id != id)
    response.status(204).end()
})

app.use(morgan(' :content'))

app.post('/api/persons', (request, response) => {
    const person = request.body
    
    if (!person.hasOwnProperty('name')) {
        response.status(400).json( { error: 'no name' })
    } else if (!person.hasOwnProperty('num')) {
        response.status(400).json( { error: 'no number' })
    } else if (persons.find(object => object.name == person.name)) {
        response.status(400).json( { error: 'name must be unique' })
    } else {
        person.id = Math.floor(Math.random() * 10000)
        persons = persons.concat(person)
        response.json(person)
    }
    
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})