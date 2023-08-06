//airlineModel

const mongoose = require("mongoose");
const connectionString = `mongodb+srv://neshwin25:1bwjdA3tkkCBWHkg@cluster0.6bfkhvz.mongodb.net/AMS?retryWrites=true&w=majority`;
const Airport = require("./airportModel");
const Reservation = require("./reservationModel");

// database connection
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connection successful");
  })
  .catch((e) => {
    {
      console.log(`database connection failed and message = ${e.message}`);
    }
  });

// schema
const airlineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter airline name"],
    },
    addressLine: {
      type: String,
      required: [true, "please enter airline address line"],
    },
    city: {
      type: String,
      required: [true, "please enter airline city"],
    },
    state: {
      type: String,
      enum: ["New York", "Alabama"],
    },
    email: {
      type: String,
      require: [true, "please enter airline city"],
      unique: true,
    },
    licenseEffectiveDate: {
      type: String,
      required: [true, "please enter airline license date"],
    },
    duration: {
      type: Number,
      enum: [6, 12, 24],
    },
    zipcode: {
      type: String,
      required: [true, "please enter airline zipcode"],
    },
    airports: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Airport",
        default: [],
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// populate query
airlineSchema.pre(/^find/, function (next) {
  this.populate("airports");
  next();
});

// license expiry date
airlineSchema.virtual("licenseExpiryDate").get(function () {
  if (this.duration && this.licenseEffectiveDate) {
    const arr = this.licenseEffectiveDate.split("-").map((el) => {
      return Number(el);
    });
    const [year, month, date] = arr;

    if (this.duration + month >= 12) {
      return `${year + 1}-${this.duration + month - 12}-${date}`;
    }

    return `${year}-${this.duration + month}-${date}`;
  }
});

// yyyy-mm-d

//format date
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// total number of flights
airlineSchema.virtual("totalNumberOfFlights").get(function () {
  let flightsNum = 0;
  this.airports.forEach((airport) => {
    flightsNum += airport.flights.length;
  });
  return flightsNum;
});

//!flights to depart today
airlineSchema.virtual("numberOfFlightsToDepartToday").get(function () {
  let c = 0;
  this.airports.forEach((airport) => {
    airport.flights.forEach((flight) => {
      if (flight.departureDate === formatDate(new Date())) {
        c++;
      }
    });
    console.log(airport);
  });
  return c;
});

const Airline = mongoose.model("Airline", airlineSchema);

module.exports = Airline;
