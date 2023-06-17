require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createUser, checkCredentials } = require('./queries');

// Middlewares
/* NOTE: Error handling
    middleware is placed at the end of the file
    because it must be placed after routes 
*/
app.use(cors());
app.use(express.json());

const checkId = (req, res, next /*,val*/) => {
  if (req.params.id < 0) {
    // return res.status(404).json({
    //   status: 'fail',
    //   message: 'id inválido 😒',
    // });
    const error = new Error('id inválido 😒');
    error.status = 'fail';
    error.statusCode = 404;
    next(error);
  }
  next();
};
app.param('id', checkId);

const checkBody = (req, res, next) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.rol ||
    !req.body.lenguaje
  ) {
    // return res.status(400).json({
    //   status: 'fail',
    //   message: 'Faltan campos en el body 😒 ',
    // });
    const error = new Error('Faltan campos en el body 😒 ');
    error.status = 'fail';
    error.statusCode = 400;
    next(error);
  }
  next();
};

const checkToken = (req, res, next) => {
  const Authorization = req.header('Authorization');
  const token = Authorization.split(' ')[1];
  if (!token) {
    // return res.status(401).json({
    //   status: 'fail',
    //   message: 'Falta el token 😒',
    // });
    const error = new Error('Falta el token 😒');
    error.status = 'fail';
    error.statusCode = 401;
    next(error);
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    // return res.status(401).json({
    //   status: 'fail',
    //   message: 'Token inválido 😒',
    // });
    error.status = 'fail';
    error.statusCode = 401;
    error.message = 'Token inválido 😒';
  }
};

// Route handlers
const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Esta ruta no ha sido implementada',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Esta ruta no ha sido implementada',
  });
};

const newUser = async (req, res, next) => {
  try {
    const user = req.body;
    await createUser(user);
    res.status(201).json({
      status: 'success',
      message: 'Usuario creado exitósamente 😎',
    });
  } catch (error) {
    // res.status(500).json({
    //   status: 'error',
    //   message: error.message,
    // });
    error.status = 'fail';
    error.statusCode = 500;
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await checkCredentials(email, password);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({
      status: 'success',
      message: 'Usuario logueado exitósamente 😎',
      token,
    });
  } catch (error) {
    error.status = 'fail';
    error.statusCode = 500;
    next(error);
  }
};

// Routes
app.route('/usuarios').get(getUsers).post(checkBody, newUser);
app.route('/usuarios/:id').get(checkToken, getUser);
app.route('/login').post(loginUser);
app.all('*', (req, res, next) => {
  const error = new Error(`No se puede encontrar ${req.originalUrl} 😒 `);
  error.status = 'fail';
  error.statusCode = 404;
  next(error);
});

/* 
  NOTE: Error handler middleware
  This middleware must be placed after routes 
*/
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
