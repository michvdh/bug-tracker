const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const HttpError = require("../model/http-error");

const signup = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }

    const { name, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await User.findOne({ email });

    if (user) {
      console.log(user);
      // this email already exists
      res.send({ emailExists: true });
    } else {
      const newUser = new User({
        name,
        email,
        password: hash,
      });

      await newUser.save();
    }
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;
    // check if email exists
    // if not, return an error.. email doesn't exist
    console.log(req.body);

    const user = await User.findOne({ email });

    console.log(user);
    if (user) {
      const typedPW = req.body.password;
      const hashedPW = user.password;

      const passwordValid = await bcrypt.compare(typedPW, hashedPW);

      console.log(passwordValid); // returns true or false

      res.json({ success: passwordValid });
    }

    // if email exists, check password
    // if incorrect password, send error, incorrect password
  } catch (err) {
    console.log(err);
  }
};

exports.signup = signup;
exports.login = login;
