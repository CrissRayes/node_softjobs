const jwt = require('jsonwebtoken');

const {
  checkEmail,
  createUser,
  checkCredentials,
  getUserInfo,
} = require('../models/queries');

// Custom Middlewares
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

const authenticateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Error('Acceso no autorizado');
    error.status = 'fail';
    error.statusCode = 401;
    return next(error);
  }

  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const error = new Error('Token inválido');
      error.status = 'fail';
      error.statusCode = 401;
      return next(error);
    }
    req.email = decoded.email;
    next();
  });
};

// Route Handlers
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
    const { email } = req;
    const userInfo = await getUserInfo(email);
    res.status(200).json(userInfo);
  } catch (error) {
    error.status = 'fail';
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = {
  checkBody,
  authenticateToken,
  newUser,
  loginUser,
  getUser,
};
