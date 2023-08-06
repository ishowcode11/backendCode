//reservationModel

const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add First name"],
  },

  lastName: {
    type: String,
    required: [true, "PLease add Last name"],
  },

  middleName: {
    type: String,
    required: false,
  },

  dob: {
    type: String,
    required: [true, "Enter date of birth"],
  },

  fliesTo: {
    type: String,
    required: [true, "Please enter flies to"],
  },

  fare: {
    type: Number,
    required: [true, "please enter the fare"],
  },

  reservationStatus: {
    type: Boolean,
    required: [true, "please enter reservation status"],
    default: false,
  },
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

reservationSchema.virtual("age").get(function () {
  const dobArray = this.dob.split("-").map((el) => {
    return Number(el);
  });

  const currentDateArray = formatDate(new Date())
    .split("-")
    .map((el) => {
      return Number(el);
    });
  const [year, month, date] = dobArray;
  const [currentYear, currentMonth, currentDate] = currentDateArray;

  if (currentMonth > month || (currentMonth === month && currentDate >= date)) {
    return currentYear - year;
  }
  return currentYear - year - 1;
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
