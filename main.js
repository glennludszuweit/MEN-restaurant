const express = require("express");
const httpStatus = require("http-status-codes");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

/////MIDDLEWARE/////
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(express.static("public"));

/////DATABASE/////
mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true });
const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connection made!");
});

/////ROUTE REGISTER/////
//homeController
app.get("/", homeController.indexPage);
app.get("/courses", homeController.showCourses);
// app.get("/contact", homeController.showSignUp);
// app.post("/contact", homeController.postedSignUpForm);
//subscribersController
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);
app.get(
  "/subscribers",
  subscribersController.getAllSubscribers,
  (req, res, next) => {
    console.log(req.data);
    res.render("subscribers", { subscribers: req.data });
  }
);
//errorController
app.use(errorController.pageNotFound);
app.use(errorController.internalServerError);

/////SERVER/////
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
