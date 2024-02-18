const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGOBD_URI

mongoose
    .connect(url)
    .then(() => {
        console.log("Connected to Mongo DB")
    })
    .catch(error => {
        console.log("Error connecting to Mongo DB", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d{5,}/.test(v)
            },
            message: props => `${props.value} is not a valid number. Please check if the number is in xxx-xxxxxx or xx-xxxxxx format`
        },
        required: true
    },
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)


