require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const Person = require("./models/person")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


morgan.token('body', request => {
    return JSON.stringify(request.body)
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// get information about phonebook
app.get("/info", async (request, response, next) => {
    await Person
        .estimatedDocumentCount()
        .then(count =>{
            response.send(`<p>Phonebook has info for ${count} people</p><br/>${Date()}`)
        })
        .catch(error => error(next))
})

// get list of persons from the phonebook
app.get("/api/persons", (request, response, next) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))  
})

// get a person with id from the phonebook
app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person
        .findById(id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error)) 
})

// delete a person with id from the phonebook
app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person
        .findByIdAndDelete(id)
        .then(result => {
            if(result.deletedCount !== 0) {
                response.status(204).end()
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error)) 
})

// create a person in the phonebook
app.post("/api/persons", (request, response, next) => {   
    const body = request.body
    if (body.name === undefined || body.name === null) {
        response.status(400).json({
            error: "name missing"
        })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    newPerson
        .save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

// update a person with id in the phonebook 
app.put("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const personToUpdate = {
        name: body.name,
        number: body.number,
    }

    Person
        .findByIdAndUpdate(id, personToUpdate, { new : true })
        .then(updatedPerson => {
            if(updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).json({
                    error: `${body.name} does not exist in the phonebook anymore. Please refresh the page and try again!`
                })
            }
        })
        .catch(error => next(error)) 
})

// error handling function
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message})
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})