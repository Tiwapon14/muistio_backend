require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')


const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('---')
    next() 
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Terve Tiwapon</h1>')
})

app.post('/api/notes/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

const note = new Note({
  id: "",
  content: body.content,
  important: body.important || false,
  date: new Date(),
})

note.save().then(savedNote => {
  response.json(savedNote)
})
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.delete('/api/notes/:id', (req, res) => {
    Note.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
  })

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
    .then(note => {
      if (note){
      response.json(note)
      }else{
      response.status(404).end()
    }
  }) 
  .catch(error => {
    next(error)
  })
})

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body
  
  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(req.params.id, note, {new: true})
  .then(updateNote => {
    res.json(updateNote)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'väärin muotoilu id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT,() =>{
console.log(`Palvelin käynnissä portissa ${PORT}`)
})
