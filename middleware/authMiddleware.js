const jwt = require("jsonwebtoken");
const User = require("../models/userData");

const protect = async (req, res, next) => {
  try {
    // console.log(req.cookies.jwtoken);
    const token = req.cookies.jwtoken;

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens:token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send("unauthorized: no token provided");
    console.log(err);
  }
};
module.exports = protect;
