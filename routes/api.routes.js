const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");

const EventModel = require("../model/Event.model");
const UserModel = require("../model/User.model");

router.get("/api/events/:startDate/:endDate", (req, res) => {

  let startDate = new Date(req.params.startDate);
  let endDate = new Date(req.params.endDate);

  EventModel.find({ date: { $gte: startDate, $lt: endDate }  }, null, { sort: { 'date': 'asc' } })
    .then((eventsData) => {
      console.log(eventsData);
      let responseData = [];
      for (let eventData of eventsData) {
        responseData.push({
          'id': eventData.id,
          'title': eventData.title,
          'start': eventData.date,
          'location': eventData.location,
          'url': '/event-details/' + eventData.id,
          'created': eventData.createdAt,
          'update': eventData.updatedAt
        });
      }

      res.status(200)
        .type('application/json')
        .send(responseData);

    })
    .catch((e) => {
      console.log(e);
      res
        .status(500)
        .send(JSON.stringify({
          message: "Fail to fetch user information",
        }));
    });

});






module.exports = router;