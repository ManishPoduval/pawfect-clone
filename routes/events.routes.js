const express = require("express");
const router = express.Router();
const EventModel = require("../model/Event.model");
var bcrypt = require("bcryptjs");


router.get("/events", (req, res, next) => {
  EventModel.find()
    .then((event) => {
      console.log("This is an event ", event);
      res.render("events.hbs", { event });
    })
    .catch((err) => {
      console.log("Not working sorry");
    });
});


// GET route that will show the form to create new event
router.get("/events-create", (req, res, next) => {
  res.render("create-event.hbs"); // render the file I want to show
});

// POST route  will get the info from the form and create a new event in the DB
router.post("/create-event", (req, res, next) => {
  console.log("post working", req.body);
  
  EventModel.create(req.body)
    .then((event) => {
      console.log(`${event.name} added`);
      //once its added redirect the user to the events page
      res.redirect("/events");
    })
    .catch((err) => {
      console.log("There is an error", err);
      res.redirect("/create-event"); //just show the url you would like to redirect
    });
});


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


router.post("/events/:id/delete", (req, res, next) => {
  const { id } = req.params

  // findByIdAndDelete will delete the event with the passed id
  EventModel.findByIdAndDelete(id).then((event) => {
    console.log(`Event ${event.name} deleted`);
    res.redirect("/events");
  })
  .catch((err) => console.log(err));
});


module.exports = router;