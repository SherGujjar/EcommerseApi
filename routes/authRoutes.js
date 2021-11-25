const express = require('express')();

const {registerUser,loginUser,logoutUser} = require('../controllers/authController')

express.post('/register',registerUser);
express.post('/login',loginUser);
express.get('/logout',logoutUser);


module.exports = express;