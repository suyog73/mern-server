const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Bro from router");
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
      return res.status(422).json({ error: "Plz filled" });
    }
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(422).json({ error: "Email already Exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password doesn't match" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      // middleware from userSchema.js line 37
      const userRegistered = await user.save();

      // console.log(user);
      // console.log(userRegistered);

      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  try {
    console.log(res);
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Plz filled the data" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isPassword = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isPassword) {
        return res.status(400).json({ error: "Invalid Details" });
      } else {
        res.json({ message: "user login successfully" });
      }
    } else {
      return res.status(400).json({ error: "Invalid Details" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
