var jwt = require('jsonwebtoken');
const secret = "superman@123";

function createTokenforUser(user) {

      const payload = {
            id: user._id,
            email: user.email,
            profileImageURL: user.profileImageURL,
            role: user.role
      }

      const token = jwt.sign(payload, secret);
      return token;

}


function validateToken(token) {
      const payload = jwt.verify(token, secret);
      return payload;
}

module.exports = {
      createTokenforUser,
      validateToken
}