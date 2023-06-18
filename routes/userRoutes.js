const express = require('express');

const router = express.Router();

const {
  checkBody,
  authenticateToken,
  newUser,
  loginUser,
  getUser,
} = require('../controllers/userController');

router
  .route('/usuarios')
  .get(authenticateToken, getUser)
  .post(checkBody, newUser);

router.route('/login').post(loginUser);

module.exports = router;
