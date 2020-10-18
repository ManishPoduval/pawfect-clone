const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");

const EventModel = require("../model/Event.model");
const UserModel = require("../model/User.model");


//EDIT EVENT

// GET route to show the form to update a single event. 
router.get("/event/:id/edit", (req, res, next) => {
  const { id } = req.params;
  // console.log("this is my req.paramas", req.params);
  // console.log("this is my id", { id });

  // findById method will obtain the information of the event to show in the update form view
  EventModel.findById(id)
    .then((event) => {
      console.log("Event Edit", event);
      res.render("event-update-form.hbs", { event });
    });
});


// POST route to update the event element with the info updated in the form view
router.post("/event/:id/edit", (req, res, next) => {
  const { id } = req.params;

  // findByIdAndUpdate will use the information passed from the request body (create event form) to update the event
  EventModel.findByIdAndUpdate(id, { $set: req.body })
    .then((event) => {
      console.log(`Event ${event.name} updated`);
      res.redirect("/events");
    })
    .catch((err) => {
      console.log("There is an error", err);
      res.redirect("/events/{{ event._id }}/edit"); 
    });
});


//DELETE EVENT
router.post("/event/:id/delete", (req, res, next) => {
  const { id } = req.params

  // findByIdAndDelete will delete the event with the passed id
  EventModel.findByIdAndDelete(id).then((event) => {
    console.log(`Event ${event.title} deleted`);
    res.redirect("/events");
  })
  .catch((err) => console.log("event not deleted", err));
});

//EVENT DETAILS
router.get("/event-details/:id", (req, res) => {
  const { id } = req.params

  EventModel.findById(id)
    .then((eventsData) => {
      console.log('THIS IS EVENT DATA', eventsData)
      console.log(`THIS IS EVENT ${eventsData.title} DETAILS`);
      res.render("event-details.hbs", { eventsData });
    })
    .catch((err) => {
      console.log("There is an error", err);
    });
});
  






module.exports = router;