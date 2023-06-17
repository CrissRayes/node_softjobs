const bcrypt = require('bcryptjs');
const pool = require('./db');

const createUser = async (user) => {
  const { email, rol, lenguaje } = user;
  const password = bcrypt.hashSync(user.password);
  const values = [email, password, rol, lenguaje];
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

module.exports = {
  createUser,
  checkCredentials,
};
