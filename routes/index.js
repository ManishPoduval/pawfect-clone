const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home.hbs');
});

router.get("/about", (req, res) => {
  res.render("about.hbs");
});

router.get("/search", (req, res) => {
  res.render("search.hbs");
});

module.exports = router;
