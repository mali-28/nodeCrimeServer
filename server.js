const express = require('express')
const user = require("./routes/user")
const application = require("./routes/application")
const app = express()

app.use(express.json());
app.use((req, res, next) => {
    console.log("method " + req.method + " to " + req.url);
    next();
  });
  
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", `http://localhost:${port}`);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use("/uploads", express.static("uploads"));
const port = process.env.PORT || 8000;

app.use("/user", user);
app.use("/application", application);

app.get("/", (req, res) => {
    res.send("hello world")
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



