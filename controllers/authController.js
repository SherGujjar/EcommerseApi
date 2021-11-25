const {StatusCodes} = require('http-status-codes');
const User = require('../models/Users')
const CustomError = require('../errors/index')

const jwt = require('jsonwebtoken')
const {attachCookiesToResponse,createTokenUser} = require('../utils/index');

const registerUser = async (req,res)=>{
    const {name, email , password} = req.body;
    const isFirstAccount = (await User.countDocuments({}))===0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({name,email,password,role});

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser})   // this function basically attaches the cookies to response
    res.status(StatusCodes.CREATED).json({user:tokenUser})
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new CustomError.BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    const iscorrect  = await user.comparePassword(password);
    if(!iscorrect){
        throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})   // this function basically attaches the cookies to response
    res.status(StatusCodes.OK).json({user:tokenUser})
}

const logoutUser = async (req,res)=>{
    res.cookie('token','logout',{
        httpOnly : true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg:"User LOGOUT"})
}

module.exports = {registerUser,loginUser,logoutUser};
