const mongoose = require('mongoose')

const url = 'mongodb://testi:testi@ds229418.mlab.com:29418/henkilot'

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const args = process.argv

const newPerson = ( args ) => {
    const person = new Person({
        name: args[2],
        number: args[3]
    })

    person
    .save()
    .then(response => {
        console.log('person saved')
        mongoose.connection.close()
    })

}

const getAll = () => {
    console.log('puhelinluettelo:')
    Person
        .find({})
        .then(response => {
            response.forEach(person => {
                
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}

const parametrit = process.argv

if (parametrit.length > 2) {
    newPerson( parametrit )
} else {
    getAll()
}


    

