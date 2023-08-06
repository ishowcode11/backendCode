//airportController

const Airport = require("../models/airportModel");
const Airline = require("../models/airlineModel");

exports.createAirport = async (req, res) => {
  console.log(req.params.airlineCode);
  try {
    const airport = await Airport.create(req.body);
    await Airline.findByIdAndUpdate(req.params.airlineCode, {
      $push: {
        airports: airport?._id,
      },
    });
    res.status(200).json({
      status: "success",
      message: "airport created",
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteAirport = async (req, res) => {
  try {
    const airport = await Airport.findByIdAndDelete(req.params.airportCode);
    await Airline.findByIdAndUpdate(req.params.airlineCode, {
      $pull: {
        airports: airport?._id,
      },
    });
    res.status(200).json({
      status: "success",
      message: "airport deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getAllAirports = async (req, res) => {
  try {
    const airline = await Airline.findById(req.params.airlineCode);
    res.status(200).json({
      status: "success",
      results: airline.airports.length,
      data: airline.airports,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getOneAirport = async (req, res) => {
  try {
    const airport = await Airport.findById(req.params.airportCode);
    res.status(200).json({
      status: "success",
      data: airport,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateAirport = async (req, res) => {
  try {
    await Airport.findByIdAndUpdate(req.params.airportCode, req.body);
    res.status(200).json({
      status: "success",
      message: "successfully updated the airport",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};


exports.aiportsAll = async (req, res) => {
  const airports = await Airport.find();
  res.status(200).json({
    status: "success",
    airports
  })
}

// /airlines/:airlineCode/airports
