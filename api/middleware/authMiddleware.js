import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose";

const protect = async (req, res, next) => {
  let token;
  //console.log("Connected to DB Name:", mongoose.connection.name);
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      req.user = await User.findById(decoded.userId).select("-password");
      //  console.log(req.user);
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
