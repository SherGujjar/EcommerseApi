const CustomError = require('../errors/index');

const checkPermission = (requestUser,resorceUserId)=>{
    
    if(requestUser.role=== 'admin') return;
    
    if(requestUser.userId === resorceUserId.toString()) return;

    throw new CustomError.UnauthorizedError("Unauthorized to access this route");
}


module.exports = checkPermission;