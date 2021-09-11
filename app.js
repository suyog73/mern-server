const dotenv = require("dotenv");
const express = require("express");
const app = express();

dotenv.config({ path: "./.env" });

require("./db/conn");
// const User = require('./model/userSchema');

app.use(express.json());

// we link the router files to make our route easy
app.use(require("./router/auth"));

const PORT = process.env.PORT;

// Middelware
const middleware = (req, res, next) => {
  console.log("Hello my Middleware");
  next();
};

// app.get('/', (req, res) => {
//     res.send(`Hello world from the server app.js`);
// });

app.get("/about", middleware, (req, res) => {
  console.log(`Hello my About`);
  res.send(`Hello About world from the server`);
});

app.get("/contact", (req, res) => {
  // res.cookie("test", "bro");
  res.send("contact");
});

app.get("/signin", (req, res) => {
  res.send("signin");
});

app.get("/signup", (req, res) => {
  res.send("signup");
});

app.listen(PORT, () => {
  console.log("server is running at port " + PORT);
});
