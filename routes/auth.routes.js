const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const UserModel = require("../model/User.model");
const EventModel = require("../model/Event.model");



router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

router.get("/signin", (req, res) => {
  res.render("auth/signin.hbs");
});

router.post("/signup", (req, res) => {
  const { name, location, email, password, confirmpassword } = req.body;

  if (!name || !location || !email || !password || !confirmpassword) {
    res
      .status(500)
      .render("auth/signup.hbs", { message: "Please fill in all the fields!" });
    return;
  }

  let emailReg = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  if (!emailReg.test(email)) {
    res
      .status(500)
      .render("auth/signup.hbs", { message: "Please enter valid email" });
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
      });
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


//EVENTS 

router.get("/create-event", (req, res) => {
  res.render("create-event.hbs");
});

router.get("/events", (req, res) => {
  EventModel.find({ date: { $gte: new Date() }  }, null, { sort: { 'date': 'asc' } })
    .then((eventsData) => {
      console.log(eventsData);
      res.render("events.hbs", { events: eventsData });
    })
    .catch(() => {
      res
        .status(500)
        .render("auth/signin.hbs", {
          message: "Fail to fetch user information",
        });
    });

  
});

router.post("/create-event", (req, res) => {
  const { title, location, date, type } = req.body;

  if (!title || !location || !date || !type) {
    res
      .status(500)
      .render("create-event.hbs", { message: "Please fill in all the fields!" });
    return;
  }

  let dateReg = new RegExp(
    /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/
  );
  if (!dateReg.test(date)) {
    res
      .status(500)
      .render("auth/create-event.hbs", {
        message:
          "Please enter a valid date",
      });
    return;
  }

  EventModel.create({
    title,
    location,
    date,
    type, 
    // picture,
    // description
  })
    .then(() => {
      res.redirect("/");
    })
    .catch(() => {
      console.log("Failled to create event in DB");
    });


  //res.render("create-event.hbs");
});

router.get('/dummy', (req, res) => {
  res.render('dummy.hbs', { name: req.session.loggedInUser.name });
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err){
      return console.log(err);
    } 
    res.redirect('/loggedout');
  });
});

router.get("/loggedout", (req, res) => {
  res.render("auth/logout.hbs");
});

module.exports = router;
