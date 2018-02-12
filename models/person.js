const mongoose = require('mongoose')

const url = 'mongodb://testi:testi@ds229418.mlab.com:29418/henkilot'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id 
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person