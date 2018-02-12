
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

morgan.token('data', function(req, res) { 
    return JSON.stringify(req.body)
})

//GET HELLO WORLD JA INFO
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
app.get('/info', (req, res) => {
    Person
      .find({})
      .then(persons => {
        res.json({
            total: persons.length,
            time: new Date()
        })
      })
    
})

//GET PERSONS
app.get('/api/persons', (request, response) => {
    Person
      .find({})
      .then(persons => {
        response.json(persons.map(Person.format))
      })
  })

//GET ONE PERSON
app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        })
})

//DELETE
app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(person => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({error: 'huono muoto id:llä'})
        })
    
})

//POST
const generateId = () => {
    const maxId = persons.length > 0 ? persons.map(p => p.id).sort().reverse()[0] : 1
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body === undefined) {
      return response.status(400).json({error: 'name uniq'})
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person
      .save()
      .then(savedPerson => {
        response.json(Person.format(savedPerson))
      })
})

//PUT
app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    console.log(body.id)

    const person = {
        name: body.name,
        number: body.number
    }

    Person 
        .findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({error: 'malformatted id'})
        })
})


//give port
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
