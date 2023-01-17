require('dotenv').config()
const express = require('express')
const note = require('./models/note')
const app = express()
const Note = require('./models/note')


let notes =[

    {
        id: 1,
        content: "CSS on tyylimuotoilua",
        date: "2022-11-23T11:22:40.0982",
        important: true
    },
    {
        id: 2,
        content: "Selain pystyy suorittamaan ainostaan Javascript-koodi",
        date: "2022-11-23T11:22:50.0007",
        important: false
    },
    {
        id: 3,
        content: "PHP-ohjelmointikieltä käytetään back-end onjelmoinnissa",
        date: "2022-11-23T11:24:09.0313",
        important: true
    },
    {
        id: 4,
        content: "Tietokannat on englanniksi password",
        date: "2022-11-23T11:44:09.0000",
        important: false
    }
]

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('---')
    next() 
}

app.use(express.json())

app.use(requestLogger)

app.use(express.static('build'))


app.get('/', (req, res) => {
    res.send('<h1>Terve Tiwapon</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

  
  app.post('/api/notes/', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
      }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })
  
    note.save().then(savedNote => {
      response.json(savedNote)
    })
    
  })

  app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
  
    res.status(204).end()
  })


app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
    
  })

 

const unknownEndpoint = (req, res) => {
res.status(404).send({ error: 'unknown endpoint'})
}


app.use(unknownEndpoint)



    

const PORT = process.env.PORT
app.listen(PORT,() =>{
console.log(`Palvelin käynnissä portissa ${PORT}`)
})
