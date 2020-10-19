const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true } //find out when booking happened
);

module.exports = mongoose.model('Booking', bookingSchema);

// module.exports = buildSchema(
//   type Booking{
//     _id: ID!
//     event: Event! 
//     user: User!
//     createdAt; String!
//     updatedAt: String!
//   }
// )