const bcrypt = require('bcryptjs');
const pool = require('./db');

const checkEmail = async (email) => {
  const sqlQuery = 'SELECT * FROM usuarios WHERE email = $1';
  const values = [email];

  const { rows } = await pool.query(sqlQuery, values);
  return rows.length > 0;
};

const createUser = async (user) => {
  const { email, rol, lenguage, password } = user;
  const hashedPassword = bcrypt.hashSync(password);
  const values = [email, hashedPassword, rol, lenguage];
  const sqlQuery = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)';

  await pool.query(sqlQuery, values);
};

const checkCredentials = async (email, password) => {
  const sqlQuery = 'SELECT * FROM usuarios WHERE email = $1';
  const values = [email];

  const { rows } = await pool.query(sqlQuery, values);

  if (rows.length === 0) {
    throw new Error('El usuario no existe');
  }

  if (!password) {
    throw new Error('Contraseña no ingresada');
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

  if (rows.length === 0) {
    throw new Error('El usuario no existe');
  }

  return rows[0];
};

module.exports = {
  checkEmail,
  createUser,
  checkCredentials,
  getUserInfo,
};
