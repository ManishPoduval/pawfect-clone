const express = require('express');
const router  = express.Router();
const UserModel = require("../model/User.model");
const MessageModel = require("../model/Message.model");
 
// router.use((req, res, next) => {
//   if (req.session.loggedInUser) {
//     next();
//   } else {
//     res.redirect("/signin");
//   }
// });

router.get("/messages", (req, res) => {
  let received;
  let sent;
  let userId = req.session.loggedInUser._id;
  MessageModel.find({recipient: userId}).sort({createdAt: -1})
  .populate("sender")
  .then((receivedData)=> {
    console.log("received data:", receivedData);
    MessageModel.find({sender: userId}).sort({createdAt: -1})
    .populate("recipient")
    .then((sentData)=> {
      console.log("sentdata:", sentData);
      res.render("messages/messagelog.hbs", {received: receivedData, sent: sentData});
    })
    .catch((err) => {
      console.log("Failed to fetch sent messages", err);
    });
  })
  .catch((err) => {
    console.log("Failed to fetch received messages", err);
  });
});

router.get("/messages/send/:id", (req,res) => {
  let id = req.params.id;
  UserModel.findById(id)
  .then((data) => {
    res.render("messages/message.hbs", {data});
  })
  .catch((err) => {
    console.log("Failed to retrieve recipient information", err);
  });
  
});

router.post("/messages/send/:id", (req,res) => {
  let {content} = req.body;
  let recipientId = req.params.id;
  let userId = req.session.loggedInUser._id;

  MessageModel.create({
    recipient: recipientId,
    sender: userId,
    content
  })
  .then(() => {
    res.redirect("/messages");
  })
  .catch((err) => {
    console.log("Failed to send message", err);
  });
});

router.get("/messages/:id", (req,res) => {
  MessageModel.findById(req.params.id)
  .populate("sender")
  .populate("recipient")
  .then((data) => {
    console.log("Recipient:", data.recipient);
    console.log("Sender:", data.sender);
    if(req.session.loggedInUser._id != data.sender._id){
      res.render("messages/messagedetails.hbs", {data, notUser: true});
    }
    else{
      res.render("messages/messagedetails.hbs", {data, notUser: false});
    }
  })
  .catch((err) => {
    console.log("Failed to retrieve message details", err);
  });
});


module.exports = router;