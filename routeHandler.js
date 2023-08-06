//routeHandler
const router = require("express").Router();
const airlineController = require("./controllers/airlineController");
const airportController = require("./controllers/airportController");
const flightController = require("./controllers/flightController");
const reservationController = require("./controllers/reservationController");


// !all 

router.route("/airports").get(airportController.aiportsAll)
router.route("/flights").get(flightController.flightsAll);
router.route("/reservations").get(reservationController.reservationsAll);

// AIRLINES
router
  .route("/airlines")
  .get(airlineController.getAllAirlines) // get All airlines
  .post(airlineController.createAirline); // create airline

router
  .route("/airlines/:airlineCode")
  .get(airlineController.getOneAirline)
  .patch(airlineController.updateAirline)
  .delete(airlineController.deleteAirlines);

// AIRPORTS
router
  .route("/airlines/:airlineCode/airports")
  .get(airportController.getAllAirports)
  .post(airportController.createAirport);
router
  .route("/airlines/:airlineCode/airports/:airportCode")
  .get(airportController.getOneAirport)
  .patch(airportController.updateAirport)
  .delete(airportController.deleteAirport);

// FLIGHTS
router
  .route("/airlines/:airlineCode/airports/:airportCode/flights")
  .get(flightController.getAllFlights)
  .post(flightController.createFlight);

router
  .route("/flights/search")
  .get(flightController.searchFlight);
router
  .route("/airlines/:airlineCode/airports/:airportCode/flights/:flightCode")
  .get(flightController.getOneFlight)
  .patch(flightController.updateFlight)
  .delete(flightController.deleteFlight);

// RESERVATIONS
router
  .route(
    "/airlines/:airlineCode/airports/:airportCode/flights/:flightCode/reservations"
  )
  .get(reservationController.getAllReservations)
  .post(reservationController.createReservation);
router
  .route(
    "/airlines/:airlineCode/airports/:airportCode/flights/:flightCode/reservations/:reservationCode"
  )
  .get(reservationController.getOneReservation)
  .patch(reservationController.updateReservation)
  .delete(reservationController.deleteReservation);

// ! For testing datetime values, remove in prod
router.route("/test").post(reservationController.testReservation);

module.exports = router;
