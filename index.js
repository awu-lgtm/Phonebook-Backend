const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/persons')
var morgan = require('morgan')
var split = require('split')
const { c } = require('tar')
const res = require('express/lib/response')
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

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person
        .findById(id)
        .then(person => response.json(person))
        .catch(error => next(error))
    }
)

app.get('/info', (request, response) => {
    Person.countDocuments({}, (err, count) => response.send(`Phonebook has info for ${JSON.stringify(count)} people <br/><br/> ${new Date()}`))})

app.delete('/api/persons/:id', (request, response, next) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    
    response.status(204).end()
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    console.log(body)

    const person = {
        name: body.name,
        num: body.num
    }

    console.log(person)

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            console.log(updatedPerson)
            response.json(updatedPerson)
        })
        .catch(error => next(error))
        
})

app.use(morgan(' :content'))

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.hasOwnProperty('name')) {
        response.status(400).json( { error: 'no name' })
    } else if (!body.hasOwnProperty('num')) {
        response.status(400).json( { error: 'no number' })
    }

    const person = new Person({
        name: body.name,
        num: body.num
    })

    person
        .save()
        .then(savedPerson => response.json(savedPerson))
})
 
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    
    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})