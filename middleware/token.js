const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.ACCESS_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    );
  });
};

const tokenChecker = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(400).json({ message: "auth error" });
    } else {
      jwt.verify(
        req.cookies.accessToken,
        process.env.ACCESS_SECRET,
        async (err, result) => {
          if (err) {
            res.status(400).json({ message: "auth error" });
          } else {
            delete result.iat;
            delete result.exp;
            const newToken = await generateToken(result);
            res.cookie("accessToken", newToken, {
              domain: "localhost",
              path: "/",
              httpOnly: true,
              // secure: true, (https 사용시 추가)
              sameSite: "none",
              maxAge: 1000 * 60 * 60 * 24,
              overwrite: true,
            });
            next();
          }
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = tokenChecker;
