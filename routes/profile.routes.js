const express = require("express");
const router = express.Router();
const UserModel = require("../model/User.model");
var bcrypt = require("bcryptjs");


router.get("/profile", (req, res) => {
  let userData = req.session.loggedInUser;
  res.render("profiles/profile", { userData });
});

router.get("/profile/edit", (req, res) => {
  let userData = req.session.loggedInUser;
  res.render("profiles/edit-profile", { userData });
});

router.get("/profile/:id", (req, res) => {
  let id = req.params.id;
  UserModel.findById(id)
    .then((userData) => {
      res.render("profiles/profile", { userData });
    })
    .catch((err) => {
      console.log("Failed to retrieve user information from database", err);
    });
});

router.get("/profile/edit/password", (req, res) => {
  res.render("profiles/edit-password");
});

router.post("/profile/edit", (req, res) => {
  let userId = req.session.loggedInUser._id;
  UserModel.findByIdAndUpdate(userId, req.body)
    .then(() => {
      UserModel.findById(userId)
        .then((data) => {
          req.session.loggedInUser = data;
          console.log(req.session.loggedInUser);
          res.redirect("/profile");
        })
        .catch((err) => { console.log("failed to update session info", err); });
    })
    .catch((err) => {
      console.log("failed to update profile in dtabase", err);
    });
});

router.post("/profiles/edit/password", (req, res) => {
  let { password, newPassword, confirmPassword } = req.body;
  let userId = req.session.loggedInUser._id;

  if (newPassword !== confirmPassword) {
    res.status(500).render("profile/edit-password", { message: "New password and confirmed password do not match" });
    return;
  }

  //SOMETHING IS BROKEN HERE!!!!!
  UserModel.findById(userId)
    .then((userData) => {
      bcrypt.compare(password, userData.password)
        .then((result) => {
          if (result) {
            bcrypt
              .genSalt(10)
              .then((salt) => {
                bcrypt
                  .hash(password, salt)
                  .then((hashedPassword) => {
                    UserModel.findByIdAndUpdate(userId, { $set: { password: hashedPassword } })
                      .then(() => {
                        res.redirect("/profile");
                      })
                      .catch((err) => {
                        console.log("Failed to update password in database", err);
                      });
                  })
                  .catch(() => {
                    console.log("Failed to hash PW");
                  });
              })
              .catch(() => {
                console.log("Failed to generate salt");
              });
          }
          else{
            res.status(500).render("profile/edit-password", { message: "Old password does not match your user information" });
            return;
          }
        });
    })
    .catch((err) => {
      console.log("failed to validate password in database", err);
      res.status(500).render("profile/edit-password", { message: "Database connection failed. Please try again." });
      return;
    });
});

module.exports = router;