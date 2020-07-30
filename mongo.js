const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length === 4) {
    console.log('give both name and number as argument')
    process.exit(1)
}
  
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.uedcz.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Persons', personSchema)


if (!name) {
    Person.find({}).then(persons => {
        persons.forEach(person => console.log(person))
        mongoose.connection.close()
    })
    
} else {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log('person added!')
        mongoose.connection.close()
    })
}