const express = require('express')();
const {authenticateUser,authenticatePermission} = require('../middleware/authentication')

const {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword} = require('../controllers/userController')

express.get('/',authenticateUser,authenticatePermission('admin'),getAllUsers);

// the authenticate permission is now called right away and demands for a call back
// since we call it right a way therefore it doesnot have access to req,res,next 
// as a result we will written a call back having res,req,next and also check there whether the roles provides in the function 
// have roles in req if yes than we allow access to them else not.

express.get('/showMe',authenticateUser,showCurrentUser);

express.patch('/updateUser',authenticateUser,updateUser);

express.patch('/updateUserPassword',authenticateUser,updateUserPassword);

express.get('/:id',authenticateUser,getSingleUser);   // it is necessary to place id below because if we place above than what ever we pass in route
// will be treated as id.

module.exports = express;