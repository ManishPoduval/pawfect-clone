const {Schema, model} = require("mongoose");

let MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  content: {
    type: String,
    required: true
  },
  previous: Schema.Types.ObjectId
},
{
  timestamps: true
});

module.exports = model("Message", MessageSchema);