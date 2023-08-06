//flightModel

const mongoose = require("mongoose");

const flightScheme = new mongoose.Schema({
  departsFrom: {
    type: String,
    required: [true, "Please enter Departure airport"],
  },

  arrivesAt: {
    type: String,
    required: [true, "Please enter Arrival airport"],
  },

  departureDate: {
    type: String,
    required: [true, "Please enter Departure date"],
  },

  arrivalDate: {
    type: String,
    required: [true, "Please enter Arrival date"],
  },

  make: {
    type: String,
    required: false,
  },

  model: {
    type: String,
    required: false,
  },

  capacity: {
    type: Number,
    required: [true, "Please enter the capacity"],
  },

  reservations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Reservation",
      default: [],
    },
  ],
});

flightScheme.pre(/^find/, function (next) {
  this.populate("reservations");
  next();
});

const Flight = mongoose.model("Flight", flightScheme);

module.exports = Flight;
