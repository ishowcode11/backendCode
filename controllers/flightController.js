//flightController
const dayjs = require("dayjs");

const Flight = require("../models/flightModel");
const Airport = require("../models/airportModel");

exports.createFlight = async (req, res) => {
  try {
    // code added by nevan
    departureDateTime = dayjs(req.body.departureDate);
    arrivalDateTime = dayjs(req.body.arrivalDate);

    // ? throw bad request error
    if (!departureDateTime.isBefore(arrivalDateTime)) {
      return res.status(400).json({
        status: "failed",
        message: "Arrival time cannot be before the departure time",
      });
    }

    const flight = await Flight.create(req.body);
    await Airport.findByIdAndUpdate(req.params.airportCode, {
      $push: {
        flights: flight?._id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Flight created successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.flightCode);
    await Airport.findByIdAndUpdate(req.params.airportCode, {
      $pull: {
        flights: req.params.flightCode,
      },
    });
    res.status(200).json({
      status: "success",
      message: "flight deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { flightCode } = req.params;
    await Flight.findByIdAndUpdate(flightCode);
    res.status(200).json({
      status: "success",
      message: "flight updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getAllFlights = async (req, res) => {
  try {
    const airport = await Airport.findById(req.params.airportCode);
 //   const flights = await Flight.find();
    res.status(200).json({
      status: "success",
      results: airport.flights.length,
      data: airport.flights,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getOneFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.flightCode);
    res.status(200).json({
      status: "success",
      data: flight,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.searchFlight = async (req, res) => {
  try {
    const flights = await Flight.find(req.query);
    res.status(200).json({
      status: "success",
      data: flights,
    });
  } catch (err) {
    res.status(404).json({
      status: "success",
      message: err.message,
    });
  }
};


exports.flightsAll = async (req, res) => {
  const flights = await Flight.find();
  res.status(200).json({
    status: "success",
    flights
  })
}
