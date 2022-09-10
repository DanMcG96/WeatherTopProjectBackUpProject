"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require("uuid");
const stationAnalytics = require("../utils/station-analytics");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const firstName = request.params.firstName;
    
    const viewData = {
      title: "WeatherTop 2 Dashboard",
      station: stationStore.getUserStations(loggedInUser.id),
    };
    logger.info("about to render", stationStore.getAllStations());
    response.render("dashboard", viewData);
  },
  
  deleteStation(request, response) {
    const stationId = request.params.id;
    logger.debug(`Deleting Station ${stationId}`);
    stationStore.removeStation(stationId); 
    response.redirect("/dashboard");
  },
  
  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const stationId = request.params.id;
    const readingId = request.params.readingid;
   
      
    
    const newStation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      firstName: loggedInUser.firstName,
      title: request.body.title,
      latitude: Number(request.body.latitude),
      longitude: Number(request.body.longitude),
      readings: [
        {
          id: uuid.v1(),
          code: "100",
          temp: "1",
          windSpeed: "1",
          windDirection: "10",
          pressure: "1000"
        }
      ]
    };
    logger.debug("Creating a new Station", newStation);
    stationStore.addStation(newStation);
    response.redirect("/dashboard");
  }
  
};


module.exports = dashboard;

 


