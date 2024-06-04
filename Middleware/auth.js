const jwt = require('jsonwebtoken');

function verifyAccessToken(token) {
  const secret = process.env.JWT_SECRET; // secret key from env file
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error };
  }
}

const authenticateToken = (req, res, next) => {

  //get jwt token from request header

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(' ')[1];

  // Verify token
  const result = verifyAccessToken(token);

  if (!result.success) {
    if (result.error) {
      if (result.error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Unauthorized: Token expired" });
      } else {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
    }

  }

  //attach login user data to request
  req.user = result.data;
  next();
}

exports.authenticateToken = authenticateToken;