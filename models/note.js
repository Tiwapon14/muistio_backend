const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const url = process.env.MONGODB_URI

console.log('Yhdistetään', url)
mongoose.connect(url)
.then(result =>{
    console.log('Yhdistetty tietokantaan MongoDB')
})
.catch((error) => {
    console.log('Virhe yhdistettäessä tietokantaan MongoDB:', error.message)
})

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)
