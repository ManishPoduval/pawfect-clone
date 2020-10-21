const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const UserModel = require("../model/User.model");
const EventModel = require("../model/Event.model");


router.get("/signup", (req, res) => {
  req.app.locals.notUser = !req.session.loggedInUser;
  res.render("auth/signup.hbs");
});

router.get("/signin", (req, res) => {

  req.app.locals.notUser = !req.session.loggedInUser;
  res.render("auth/signin.hbs");
});

router.post("/signup", (req, res) => {
  const { name, location, email, password, confirmpassword } = req.body;

  if (!name || !location || !email || !password || !confirmpassword) {
    res
      .status(500)
      .render("auth/signup.hbs", { message: "Please fill in all the fields!", request: req.body });
    return;
  }

  let emailReg = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  if (!emailReg.test(email)) {
    res
      .status(500)
      .render("auth/signup.hbs", { message: "Please enter valid email", request: req.body });
    return;
  }

  let passwordReg = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
  );
  if (!passwordReg.test(password)) {
    res
      .status(500)
      .render("auth/signup.hbs", {
        message:
          "Password must have one lowercase, one uppercase, a number, a special character and must be atleast 8 digits long",
      request: req.body});
    return;
  }

  if (password !== confirmpassword) {
    res
      .status(500)
      .render("auth/signup.hbs", {
        message: "Passwords do not match! Please try again.",
      });
    return;
  }

  bcrypt
    .genSalt(10)
    .then((salt) => {
      bcrypt
        .hash(password, salt)
        .then((hashedPassword) => {
          UserModel.create({
            name,
            location,
            email,
            password: hashedPassword,
          })
            .then(() => {
              res.redirect("/signin");
            })
            .catch(() => {
              console.log("Failled to create user in DB");
            });
        })
        .catch(() => {
          console.log("Failled to hash PW");
        });
    })
    .catch(() => {
      console.log("Failled to generate salt");
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email })
    .then((userData) => {

      if (!userData) {
        res
          .status(500)
          .render("auth/signin.hbs", { message: "User does not exist" });
        return;
      }

      bcrypt
        .compare(password, userData.password)
        .then((result) => {
          if (result) {
            req.session.loggedInUser = userData;
            res.redirect("/profile");
          } else {
            res
              .status(500)
              .render("auth/signin.hbs", { message: "Password not matching" }); //difined your message in signin.hbs
          }
        })
        .catch(() => {
          res
            .status(500)
            .render("auth/signin.hbs", { message: "Something went wrong" });
        });
    })
    .catch(() => {
      res
        .status(500)
        .render("auth/signin.hbs", {
          message: "Fail to fetch user information",
        });
    });
});

router.get("/loggedout", (req, res) => {
  req.app.locals.notUser = !req.session.loggedInUser;
  res.render("auth/logout.hbs");
});

module.exports = router;

//PRIVATE ROUTES

router.use((req, res, next) => {
  if (req.session.loggedInUser) {
    req.app.locals.notUser = !req.session.loggedInUser;
    next();
  } else {
    res.redirect("/signin");
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err){
      return console.log(err);
    } 
    res.redirect('/loggedout');
  });
});


