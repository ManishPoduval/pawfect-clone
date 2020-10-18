const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");

const EventModel = require("../model/Event.model");
const UserModel = require("../model/User.model");



// router.get("/events", (req, res, next) => {
//   EventModel.find()
//     .then((event) => {
//       console.log("This is an event ", event);
//       res.render("events.hbs", { event });
//     })
//     .catch((err) => {
//       console.log("Not working sorry");
//     });
// });




// GET route to show the form to update a single event. It needs to show the current DB information.
router.get("/event/:id/edit", (req, res, next) => {
  const { id } = req.params;
  // console.log("this is my req.paramas", req.params);
  // console.log("this is my id", { id });

  // findById method will obtain the information of the drone to show in the update form view
  EventModel.findById(id)
    .then((event) => {
      console.log("Event Edit", event);
      res.render("event-update-form.hbs", { event });
    });
});


// POST route to update the event element with the info updated in the form view
router.post("/event/:id/edit", (req, res, next) => {
  const { id } = req.params;

  // findByIdAndUpdate will use the information passed from the request body to update the event
  EventModel.findByIdAndUpdate(id, { $set: req.body })
    //after this task is complete, I want to redirect the page
    .then((event) => {
      console.log(`Event ${event.name} updated`);
      res.redirect("/events");
    })
    .catch((err) => {
      console.log("There is an error", err);
      res.redirect("/events/{{ event._id }}/edit"); //just show the url you would like to redirect
    });
});


router.post("/event/:id/delete", (req, res, next) => {
  const { id } = req.params

  // findByIdAndDelete will delete the event with the passed id
  EventModel.findByIdAndDelete(id).then((event) => {
    console.log(`Event ${event.name} deleted`);
    res.redirect("/events");
  })
  .catch((err) => console.log("event not deleted", err));
});


module.exports = router;