// Import mongoose module
const mongoose = require('mongoose')

//Check in there is a password argument passed in command line
//If no password argument, log message and exit the process
if(process.argv.length<3){
    console.log('anna salasana argumentiksi')
    process.exit(1)
}
//Assing the password argument to avariable
const password = process.argv [2]
//Create connection url with password
                          //tähän käyttäjäni ja salasana                        
const url = `mongodb+srv://<username>:${password}@<username>.7aq8wtz.mongodb.net/<DBname>?retryWrites=true&w=majority`
//Connect to MongoDB using the url
mongoose.connect(url)
// Create a note schema with properties content, date and important
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})
// Create note model using the schema
const Note = mongoose.model('Note',noteSchema)
//Create a new note object with values
const note = new Note({
    content: 'Mongoose on kirjasto MongoDB:lle',
    date: new Date(),
    important: true,
})
//Save the note to the database and log message 
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    
    mongoose.connection.close()
})