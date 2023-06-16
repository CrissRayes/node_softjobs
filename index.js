require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

// Middlewares
app.use(cors())
app.use(express.json())

// Route handlers
// Routes
// Start server
