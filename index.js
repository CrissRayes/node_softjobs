require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', userRoutes);

app.all('*', (req, res, next) => {
  const error = new Error(
    `No se puede encontrar ${req.originalUrl} en este servidor`
  );
  error.status = 'fail';
  error.statusCode = 404;
  next(error);
});

// Error handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`); // eslint-disable-line no-console
});
