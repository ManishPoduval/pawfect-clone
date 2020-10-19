const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");

const UserModel = require("../model/User.model");
const EventModel = require("../model/Event.model");

//EVENTS

router.get("/create-event", (req, res) => {
  res.render("create-event.hbs");
});

router.get("/events", (req, res) => {
  EventModel.find({ date: { $gte: new Date() } }, null, {
    sort: { date: "asc" },
  })
    .then((eventsData) => {
      //console.log(req.session.loggedInUser._id)
      //console.log(eventsData[0].user);

      res.render("events.hbs", { events: eventsData });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render("auth/signin.hbs", {
        //redirect to somewhereelse
        message: "Fail to fetch user information",
      });
    });
});

router.post("/create-event", (req, res) => {
  const { title, location, date, type } = req.body;

  if (!title || !location || !date || !type) {
    res.status(500).render("create-event.hbs", {
      message: "Please fill in all the fields!",
    });
    return;
  }

  let dateReg = new RegExp(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/);
  if (!dateReg.test(date)) {
    res.status(500).render("auth/create-event.hbs", {
      message: "Please enter a valid date",
    });
    return;
  }

  //take the ID number of the currently logged in user
  let newUser = req.session.loggedInUser._id;

  EventModel.create({
    title,
    location,
    date,
    type,
    user: newUser,
    // picture,
    // description
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Failled to create event in DB", err);
    });

  //res.render("create-event.hbs");
});

//EDIT EVENT

// GET route to show the form to update a single event.
router.get("/event/:id/edit", (req, res, next) => {
  const { id } = req.params;
  // console.log("this is my req.paramas", req.params);
  // console.log("this is my id", { id });

  // findById method will obtain the information of the event to show in the update form view
  EventModel.findById(id).then((event) => {
    console.log("Event Edit", event);
    console.log(event.user);
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
  const { id } = req.params;

  // findByIdAndDelete will delete the event with the passed id
  EventModel.findByIdAndDelete(id)
    .then((event) => {
      console.log(`Event ${event.title} deleted`);
      res.redirect("/events");
    })
    .catch((err) => console.log("event not deleted", err));
});

//EVENT DETAILS
router.get("/event-details/:id", (req, res) => {
  const { id } = req.params;

  EventModel.findById(id)
    .populate("user")
    .then((eventsData) => {
      // console.log("THIS IS EVENT DATA", eventsData);
      // console.log(`THIS IS EVENT ${eventsData.user} DETAILS`);
      //console.log(req.session.loggedInUser._id === eventsData.user._id)
      //console.log(eventsData)
      if (
        JSON.stringify(req.session.loggedInUser._id) ===
        JSON.stringify(eventsData.user._id)
      ) {
        res.render("event-details.hbs", { eventsData, user: true });
      } else {
        res.render("event-details.hbs", { eventsData });
      }
    })
    .catch((err) => {
      console.log("There is an error", err);
    });
});

module.exports = router;
