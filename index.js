const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', request => {
    return JSON.stringify(request.body)
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
        { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
        },
        { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
        },
        { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
        },
        { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
        }
    ]

app.get("/info", (request, response) => {
    const personsCount = persons.length
    response.send(`<p>Phonebook has info for ${personsCount} people</p><br/>${Date()}`)
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const personToDelete = persons.find(person => person.id === id)
    if(personToDelete) {
        persons = persons.filter(person => person.id !== id)
        console.log(personToDelete)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
    
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    if(body.name && body.number) {
        if(!persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())){
            const person = {
                name: body.name,
                number: body.number,
                id: Math.floor((Math.random() * Math.random() * Math.random() ) * 10000000),
            }
            persons = persons.concat(person)

            response.json(person)
        } else {
            response.status(400).json({
                error: "name must be unique"
            })
        }
    } else {
        response.status(400).json({
            error: "Missing name or number"
        })
    }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})