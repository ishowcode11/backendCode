//reservationController

const Reservation = require("../models/reservationModel");
const Flight = require("../models/flightModel");
const { createFlight } = require("./flightController");

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

//Added function to check dob>todays date
function checkDOB(y1, m1, d1, y2, m2, d2) {
  let a = y1 !== y2 && y2 > y1;
  let b = m1 !== m2 && m2 > m1;
  let c = d1 !== d2 && d2 > d1;

  return a || b || c;
}

// ?arrivalDate=202

exports.getAllReservations = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.flightCode);
    const reservations = await Reservation.find(req.query);

    res.status(200).json({
      status: "success",
      results: flight.reservations.length,
      data: flight.reservations,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getOneReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationCode);
    res.status(200).json({
      status: "success",
      data: reservation,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

//need to push the reservation object back to the flight table

exports.createReservation = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    const flight = await Flight.findById(req.params.flightCode);

    //check if the dob > todays date
    const { dob } = req.body;
    const todaysDate = formatDate(new Date());

    // const dobArray = dob.split("-").map((el) => {
    //   return Number(el);
    // })

    //to check of dob> todays date
    const [y1, m1, d1] = todaysDate.split("-").map((el) => {
      return Number(el);
    });

    const [y2, m2, d2] = dob.split("-").map((el) => {
      return Number(el);
    });

    if (checkDOB(y1, m1, d1, y2, m2, d2)) {
      return res.status(400).json({
        status: "failed",
        message: "Date of birth cannot be greater than todays date",
      });
    }

    // const

    // checking if the reservations are less than the flight capacity
    if (reservations.length < flight.capacity) {
      const reservation = await Reservation.create(req.body);
      await Flight.findByIdAndUpdate(req.params.flightCode, {
        $push: {
          reservations: reservation?._id,
        },
      });
      return res.status(200).json({
        status: "success",
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "Capacity Full!!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndUpdate(req.params.reservationCode, req.body);

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

exports.deleteReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.reservationCode);
    await Flight.findByIdAndUpdate(req.params.flightCode, {
      $pull: {
        reservations: req.params.reservationCode,
      },
    });
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

exports.testReservation = async (req, res) => {
  try {
    console.log(req.body.datetime);
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

exports.reservationsAll = async (req, res) => {
  const reservations = await Reservation.find();
  res.status(200).json({
    status: "success",
    reservations,
  });
};
