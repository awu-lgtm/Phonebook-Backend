const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook-admin:${password}@cluster0.ajger.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    num: String,
})

const Person = mongoose.model('Person', personSchema)

const newPerson = (name, num) => {
    const person = new Person({
        name: name,
        num: num,
    })
    console.log('hello!')
    return person
}

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(note=> {
            console.log(note)
        })
        mongoose.connection.close()
    })
} 

if (process.argv.length == 5) {
    newPerson(process.argv[3], process.argv[4])
        .save()
        .then(result => {
            console.log('person saved!')
            mongoose.connection.close()
        })
}