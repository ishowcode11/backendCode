//airlineController

const Airline = require("../models/airlineModel");

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function checkLicenseEffectiveDate(y1, m1, d1, y2, m2, d2) {
  let a = y1 !== y2 && y2 > y1;
  let b = m1 !== m2 && m2 > m1;
  let c = d1 !== d2 && d2 > d1;

  return a || b || c;
}

exports.getAllAirlines = async (req, res) => {
  try {
    const airlines = await Airline.find(req.query);
    res.status(200).json({
      status: "success",
      results: airlines.length,
      data: airlines,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getOneAirline = async (req, res) => {
  try {
    const airline = await Airline.findById(req.params.airlineCode);
    res.status(200).json({
      status: "success",
      data: airline,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.createAirline = async (req, res) => {
  try {
    // check if license effective date > todays date
    const todaysDate = formatDate(new Date());
    const licenseEffectiveDate = req.body.licenseEffectiveDate;

    const [y1, m1, d1] = todaysDate.split("-").map((el) => {
      return Number(el);
    });

    const [y2, m2, d2] = licenseEffectiveDate.split("-").map((el) => {
      return Number(el);
    });

    if (checkLicenseEffectiveDate(y1, m1, d1, y2, m2, d2)) {
      return res.status(400).json({
        status: "failed",
        message: "License Effective Date cannot be greater than todays date",
      });
    }

    // calculating derived attributes
    // let c = 0;
    // let d = 0;
    // const airlines = await Airline.find();

    // airlines.forEach((airline) => {
    //   airline.airports.forEach((airport) => {
    //     if (formatDate(new Date()) === airport.flights.departureDate) {
    //       d++;
    //     }
    //     c += airport.flights.length;
    //   });
    // });

    // req.body.totalNumberOfFlights = c;
    // req.body.totalNumberOfFlightsToDepartToday = d;

    await Airline.create(req.body);

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateAirline = async (req, res) => {
  try {
    // check licenseEffectiveDate
    await Airline.findByIdAndUpdate(req.params.airlineCode, req.body);
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteAirlines = async (req, res) => {
  try {
    await Airline.findByIdAndDelete(req.params.airlineCode);
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
