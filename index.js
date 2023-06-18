require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const {
  checkEmail,
  createUser,
  checkCredentials,
  getUserInfo,
} = require('./queries');
const errorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Custom middlewares
const checkBody = (req, res, next) => {
  const { email, password, rol, lenguage } = req.body;
  if (!email || !password || !rol || !lenguage) {
    const error = new Error('Faltan campos en el body');
    error.status = 'fail';
    error.statusCode = 400;
    return next(error);
  }
  next();
};

// Route handlers
const newUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailExists = await checkEmail(email);
    if (emailExists) {
      const error = new Error('El email ya existe');
      error.status = 'fail';
      error.statusCode = 400;
      return next(error);
    }
    await createUser(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Usuario creado exitósamente',
    });
  } catch (error) {
    error.status = 'fail';
    error.statusCode = 500;
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await checkCredentials(email, password);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    res.status(200).json(token);
  } catch (error) {
    error.status = 'fail';
    error.statusCode = 500;
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const userInfo = await getUserInfo(email);
    res.status(200).json(userInfo);
  } catch (error) {
    error.status = 'fail';
    error.statusCode = 500;
    return next(error);
  }
};

// Routes
app.route('/usuarios').get(getUser).post(checkBody, newUser);

app.route('/login').post(loginUser);

app.all('*', (req, res, next) => {
  const error = new Error(
    `No se puede encontrar ${req.originalUrl} en este servidor`
  );
  error.status = 'fail';
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`); // eslint-disable-line no-console
});
