const CustomError = require('../errors/index');
const {isTokenValid} = require('../utils/jwt');

const authenticateUser = async (req,res,next)=>{
    const token = req.signedCookies.token;
   
    if(!token){
        throw new CustomError.UnauthenticatedError("Authentication Invalid")
    }
    try{
        const{name,userId,role} = isTokenValid({token});
        req.user= {name,userId,role};
        next();
    }
    catch(err){
        throw new CustomError.UnauthenticatedError("Authentication Invalid")
    }
    
}

const authenticatePermission =  (...roles)=>{
   
    return (req,res,next)=>{
        const {role} = req.user
        if(!roles.includes(role)){
            throw new CustomError.UnauthorizedError("Unauthorized to access this route");
        }
        next();
    }
    
}

module.exports = {authenticateUser,authenticatePermission,};