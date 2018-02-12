
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan.token('data', function(req, res) { 
    return JSON.stringify(req.body)
})


let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

const date = new Date()


//GET MOTODIT
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    res.send(
        `<p>puhelinluettelossa ${persons.length} henkilön tiedot</p><br/>${date}`)
})

//DELETE
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        persons = persons.filter(person => person.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
    
})

//POST
const generateId = () => {
    const maxId = persons.length > 0 ? persons.map(p => p.id).sort().reverse()[0] : 1
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    alreadyOnList = persons.find(p => p.name === body.name)

    if (body.name === undefined) {
        return res.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return res.status(400).json({error: 'number missing'})
    } else if (body.name === undefined && body.number === undefined) {
        return res.status(400).json({error: 'name & number missing'})
    } else if (alreadyOnList) {
        return res.status(400).json({error: 'name allReady on list'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
