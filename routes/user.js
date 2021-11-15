const express = require("express");
const router = express.Router();
const md5 = require("md5");
const multer = require("../multer");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid")
const users = [];



router.post("/create", (req, res) => {

  console.log({ body: req.body })
  const email = req.body.email;
  const username = req.body.username;
  const password = md5(req.body.password);
  // const image = req.file.path;
  const isUserFound = users.some((user) => {
    return user.email === email || user.username === username
  })

  if (isUserFound) {
    res.status(403).json({ status: 403, message: "username or email already exists" })
  } else {
    const userId = uniqid();

    const createUser = {
      userId,
      username,
      email,
      password,
    }

    
    const copyUser = { ...createUser }
    delete copyUser.password
    console.log({ copyUser })
    jwt.sign(
      { user: copyUser },
      `secretkey`,
      { expiresIn: "24h" },
      (error, token) => {
        if (error) {
          res.status(400).json({ status: 400, message: "Something went wrong" });
        } else {
          res.contentType = "application/json"
          res.header("Authentication", token)
          users.push(createUser);
          res.status(200).json({
            user: copyUser,
            loggedIn: true,
            token
          });
        }
      }
    );
  }
})

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  const isUserFound = users.find((user) => {
    return user.username === username && user.password === password
  })

  if (isUserFound) {
    const copyUser = { ...isUserFound }
    delete copyUser.password
    
    jwt.sign(
      { user: copyUser },
      `secretkey`,
      { expiresIn: "24h" },
      (error, token) => {
        if (error) {
          res.status(400).json({ status: 400, message: "Something went wrong" });
        } else {
          res.contentType("application/json");
          res.status(200).json({ user: copyUser, loggedIn: true, token })
        }
      })
  } else {
    res.status(404).json({ message: "Invalid username or password" })
  }
})

router.get('/all', function (req, res) {
  res.status(200).send(users)
})
module.exports = router;