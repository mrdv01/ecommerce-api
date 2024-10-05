import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req);
    // verifiy token from jwt
    const decodedUser = verifyToken(token);
    console.log(decodedUser)

    if (!decodedUser) {
        throw new Error('token expired/invalid')
    }
    else {
        // save the user into req obj
        req.userAuthId = decodedUser?.id;
        next();
    }

}