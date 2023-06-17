const bcrypt = require('bcryptjs');
const pool = require('./db');

const createUser = async (user) => {
  const { email, rol, lenguaje } = user;
  const password = bcrypt.hashSync(user.password);
  const values = [email, password, rol, lenguaje];
  const sqlQuery = `INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)`;
  await pool.query(sqlQuery, values);
};

module.exports = {
  createUser,
};
