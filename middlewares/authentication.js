const { validateToken } = require("../utils/authentication");

function checkforAuthenticationCookie(cookiename) {

      return (req, res, next) => {

            const tokenvalue = req.cookies[cookiename];

            if (!tokenvalue) {
                  return next();
            }
            try {
                  const userPayload = validateToken(tokenvalue);
                  req.user = userPayload;

            } catch (error) { }
            return next();


      }

}


module.exports = { checkforAuthenticationCookie };