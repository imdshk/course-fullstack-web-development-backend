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

app.get("/info", async (request, response) => {
    await Person
        .estimatedDocumentCount()
        .then(count =>{
            response.send(`<p>Phonebook has info for ${count} people</p><br/>${Date()}`)
        })
        .catch(error => {
            response.status(500).end()
        })
})

app.get("/api/persons", (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => {
            response.status(500).end()
        })  
})

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

app.post("/api/persons", (request, response) => {
    const body = request.body
    if (body.name === undefined || body.name === null) {
        response.status(400).json({
            error: "name missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            response.status(500).end()
        })

    // if(name && number) {        
    //     Person
    //         .findOne({"name": name})
    //         .then(result => {
    //             console.log(result)
    //         })
        
//         if(!persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())){
//             const person = {
//                 name: body.name,
//                 number: body.number,
//                 id: Math.floor((Math.random() * Math.random() * Math.random() ) * 10000000),
//             }
//             persons = persons.concat(person)

//             response.json(person)
//         } else {
//             response.status(400).json({
//                 error: "name must be unique"
//             })
//         }
//     } else {
//         response.status(400).json({
//             error: "Missing name or number"
//         })
    // }
})

// Error handling function
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})