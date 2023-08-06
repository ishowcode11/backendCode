//airportModel

const mongoose = require("mongoose");
const Flight = require("../models/flightModel");

const airportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter the airport name"],
  },
  city: {
    type: String,
    required: [true, "please enter the airport city"],
  },
  state: {
    type: String,
    enum: ["New York", "Alabama"],
  },
  flights: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Flight",
      default: [],
    },
  ],
});

// date formatter
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// total number of flights for that airport
airportSchema.virtual("totalNumberOfFlights").get(function () {
  if (this.flights.length !== 0) {
    return this.flights.length;
  }
  return 0;
});

// total number of flights departing
airportSchema.virtual("numberOfFlightsToDepartToday").get(function () {
  if (this.flights.length !== 0) {
    let c = 0;
    this.flights.forEach((flight) => {
      if (flight.departureDate === formatDate(new Date())) {
        c++;
      }
    });
    return c;
  }
  return 0;
});

// populate query
airportSchema.pre(/^find/, function (next) {
  this.populate("flights");
  next();
});

const Airport = mongoose.model("Airport", airportSchema);

module.exports = Airport;

// yyyy-mm-dd
