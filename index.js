require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {
  checkEmail,
  createUser,
  checkCredentials,
  getUserInfo,
} = require('./queries');
const errorHandler = require('./controllers/errorController');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const checkId = (req, res, next) => {
  if (req.params.id < 0) {
    const error = new Error('id inválido');
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
    !req.body.lenguage
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
    const { email } = req.body;
    const emailExists = await checkEmail(email);
    if (emailExists) {
      const error = new Error('El email ya existe');
      error.status = 'fail';
      error.statusCode = 400;
      next(error);
    }
    await createUser(req.body);
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
      expiresIn: '9h',
    });
    res.status(200).json(token);
  } catch (error) {
    error.status = 'fail';
    error.statusCode = 500;
    next(error);
  }
};

const getUser = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  const { email } = jwt.verify(token, process.env.JWT_SECRET);
  const userInfo = await getUserInfo(email);
  res.status(200).json(userInfo);
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
  // eslint-disable-next-line no-console
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
