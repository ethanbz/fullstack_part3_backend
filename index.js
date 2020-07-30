const express = require('express')
const app = express()
let {persons} = require('./data')
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('build'))
morgan.token('content', (req, res) => { if (req.body.name) return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(per => per.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(pers => pers.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        res.status(400).json({
            error: 'name and number required'
        })
    }
    if (persons.find(pers => pers.name === body.name)) {
        res.status(400).json({
            error: `${body.name} is already in the phonebook`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.round(Math.random()*9999)
    }

    persons = persons.concat(person)

    res.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})