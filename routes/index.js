const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  req.app.locals.notUser = !req.session.loggedInUser;
  res.render('home.hbs');
});

router.get("/about", (req, res) => {
  req.app.locals.notUser = !req.session.loggedInUser;
  res.render("about.hbs");
});

module.exports = router;
