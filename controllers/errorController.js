const errorHandler = (error, req, res, next) => {
  const { statusCode = 500, message } = error;
  const status = error.status || 'error'; // eslint-disable-line no-unused-vars
  res.status(statusCode).send(message);
};

module.exports = errorHandler;
