require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createUser, checkCredentials, getUserInfo } = require('./queries');

// Middlewares
app.use(cors());
app.use(express.json());

const checkId = (req, res, next /*,val*/) => {
  if (req.params.id < 0) {
    const error = new Error('id inválido');
    error.status = 'fail';
    error.statusCode = 404;
    next(error);
  }
  next();
};
app.param('id', checkId);

const checkToken = (req, res, next) => {
  const Authorization = req.header('Authorization');
  const token = Authorization.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // throw new Error('Token inválido');
  }
  next();
};

const checkBody = (req, res, next) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.rol ||
    !req.body.lenguaje
  ) {
    const error = new Error('Faltan campos en el body');
    error.status = 'fail';
    error.statusCode = 400;
    next(error);
  }
  next();
};

// Route handlers
const newUser = async (req, res, next) => {
  try {
    const user = req.body;
    await createUser(user);
    res.status(201).json({
      status: 'success',
      message: 'Usuario creado exitósamente',
    });
  } catch (error) {
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
      message: 'Usuario logueado exitósamente',
      token,
    });
  } catch (error) {
    error.status = 'fail';
    error.statusCode = 500;
    next(error);
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await getUserInfo(id);
  const token = req.header('Authorization').split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.email !== user.email) {
    return res.status(401).json({
      status: 'fail',
      message: 'No tienes permiso para ver este usuario',
    });
  }
  res.status(200).json({
    status: 'success',
    message: 'Usuario obtenido exitósamente',
    data: {
      user,
    },
  });
};

// Routes
app.route('/usuarios').post(checkBody, newUser);
app.route('/usuarios/:id').get(checkToken, getUser);
app.route('/login').post(loginUser);
app.all('*', (req, res, next) => {
  const error = new Error(
    `No se puede encontrar ${req.originalUrl} en este servidor`
  );
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
