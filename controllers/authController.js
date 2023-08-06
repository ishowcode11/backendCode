const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const secret = "thisisasecretstring";

// signup
exports.signUp = async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({
        status: "failed",
        message: "Confirm password i",
      });
    }

    password = await bcrypt.hash(password, 12);
    confirmpassword = await bcrypt.hash(confirmpassword, 12);

    const obj = {
      email: email,
      password,
      confirmpassword,
    };

    const user = User.create(obj);
    const token = jwt.sign({ id: user._id }, secret);

    res.status(200).json({
      status: "success",
      result: token,
      message: "Token sent!",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // 1) check if the email and password
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "please enter email or password",
      });
    }
    // 2) check if email exist in the DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "The entered email does not exist",
      });
    }

    // 3) check password
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) {
      return res.status(403).json({
        status: "failed",
        message: "Incorrect password",
      });
    }

    const token = jwt.sign({ id: user._id }, secret);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
  }
};

// protect         
exports.protect = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).json({
        status: "failed",
        message: "no authorization header",
      });
    }
    // bearer gvsgsvdg

    if (!authorization.startsWith("bearer")) {
       return res.status(400).json({
        status: "failed",
        message: "authorization does not contain bearer property",
      });
    }

    const token = authorization.split(" ")[1];
    jwt.verify(token, (err, results) => {
      if (err) {
        return res.status(403).json({
          status: "failed",
          message: "unauthorized user",
        });
      }
      req.currentUser = jwt.decode(token).id;
      next();
    });
  } catch (err) {
     return res.status(403).json({
        status: "failed",
        message: err.message
      });
  }
};
