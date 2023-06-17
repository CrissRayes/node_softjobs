require('dotenv').config();
const { createUser } = require('./queries');
const express = require('express');

const app = express();
const cors = require('cors');
// const jwt = require('jsonwebtoken');

// Middlewares
app.use(cors());
app.use(express.json());

const checkId = (req, res, next /*,val*/) => {
  if (req.params.id < 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id 😒',
    });
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
    return res.status(400).json({
      status: 'fail',
      message: 'Missing fields in body 😒 ',
    });
  }
  next();
};

// TODO: implementar el checkToken
// const checkToken = (req, res, next) => {
//   const token = req.headers.authorization
//   if (!token) {
//     return res.status(401).json({
//       status: 'fail',
//       message: 'Missing token 😒'
//     })
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     console.log(decoded)
//     next()
//   } catch (err) {
//     return res.status(401).json({
//       status: 'fail',
//       message: 'Invalid token 😒'
//     })
//   }
// }
// app.use(checkToken)

// Route handlers
const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route si not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route si not yet defined',
  });
};

const newUser = async (req, res) => {
  try {
    const user = req.body;
    await createUser(user);
    res.status(201).json({
      status: 'success',
      message: 'User created successfully 😎',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const loginUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route si not yet defined',
  });
};

// Routes
app.route('/usuarios').get(getUsers).post(checkBody, newUser);
app.route('/usuarios/:id').get(getUser);
app.route('/login').post(loginUser);

app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server 😒 `);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
