const bcrypt = require('bcryptjs');
const pool = require('./db');

const checkEmail = async (email) => {
  const sqlQuery = 'SELECT * FROM usuarios WHERE email = $1';
  const values = [email];
  const { rows } = await pool.query(sqlQuery, values);
  if (rows.length) {
    return true;
  }
};

const createUser = async (user) => {
  const { email, rol, lenguage } = user;
  const password = bcrypt.hashSync(user.password);
  const values = [email, password, rol, lenguage];
  const sqlQuery = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)';
  await pool.query(sqlQuery, values);
};

const checkCredentials = async (email, password) => {
  const sqlQuery = 'SELECT * FROM usuarios WHERE email = $1';
  const values = [email];
  const { rows } = await pool.query(sqlQuery, values);
  if (!rows.length) {
    throw new Error('El usuario no existe');
  }
  const user = rows[0];
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    throw new Error('La contraseña es incorrecta');
  }
};

const getUserInfo = async (email) => {
  const sqlQuery = 'SELECT email, rol, lenguage FROM usuarios WHERE email = $1';
  const values = [email];
  const { rows } = await pool.query(sqlQuery, values);
  if (!rows.length) {
    throw new Error('El usuario no existe');
  }
  const user = rows[0];
  return user;
};

module.exports = {
  checkEmail,
  createUser,
  checkCredentials,
  getUserInfo,
};
