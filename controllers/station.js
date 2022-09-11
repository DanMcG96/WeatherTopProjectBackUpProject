'use strict';

const logger = require('../utils/logger');
const stationStore = require('../models/station-store.js');
const stationAnalytics = require("../utils/station-analytics");
const uuid = require('uuid');



const station = {
  
  index(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId); 
    const code = request.params.code;
      
      const weatherIcon = stationAnalytics.weatherIcon(request);
      const windDirection = request.params.windDirection;
      const temp = request.params.temp;
      const lastReading = stationAnalytics.getLastReading(station);
      const doWeather = stationAnalytics.getWeatherCode(request);
      const beaufort = stationAnalytics.getBeaufort(request);
      const tempInFarenheit = stationAnalytics.tempConversion(request);
      const windChill = stationAnalytics.windChill(request);
      const windCompass = stationAnalytics.windCompass(request);
      const minTemp = stationAnalytics.minTemp(station);
      const maxTemp = stationAnalytics.maxTemp(station);
      const minWindSpeed = stationAnalytics.minWindSpeed(station);
      const maxWindSpeed = stationAnalytics.maxWindSpeed(station);
      const minPressure = stationAnalytics.minPressure(station);
      const maxPressure = stationAnalytics.maxPressure(station);
      const hot = stationAnalytics.hotIcon(request);
      
  logger.info('Station id = ' + stationId);
    const viewData = {
      title: 'Station',
      station: stationStore.getStation(stationId),
      doWeather: doWeather,
      beaufort: beaufort,
        temp: temp,
        tempInFarenheit: tempInFarenheit,
        windChill: windChill,
        lastReading: lastReading,
        windCompass: windCompass,
        minTemp: minTemp,
        maxTemp: maxTemp,
        minWindSpeed: minWindSpeed,
        maxWindSpeed: maxWindSpeed,
        minPressure: minPressure,
        maxPressure: maxPressure,
        hot: hot,
        weatherIcon
        
  };
    response.render('station', viewData);
  },
  
  
  
  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.info(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect('/station/' + stationId);
  },
  
  addReading(request, response) {
    
    let clock = new Date();
    let hours = 1+(clock.getHours());
    let minutes = clock.getMinutes();
    let seconds = clock.getSeconds();
    let hoursFormatCorrection = null;
    let minutesFormatCorrection = null;
    let secondsFormatCorrection = null;
    let amOrPm = "AM"
    
    if(clock.getHours() < 10) { hoursFormatCorrection = "0";}
    
    if(clock.getHours() > 12) { amOrPm = "PM";}
    
    if(clock.getMinutes() < 10) { minutesFormatCorrection = "0"; }
    
    if(clock.getSeconds() < 10) { secondsFormatCorrection = "0"; }
    
    let date = clock.toLocaleDateString();
    
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const newReading = {
      id: uuid.v1(),
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      amOrPm: amOrPm,
      hoursFormatCorrection: hoursFormatCorrection,
      minutesFormatCorrection: minutesFormatCorrection,
      secondsFormatCorrection: secondsFormatCorrection,
      date: date,
      code: request.body.code,
      temp: Number(request.body.temp),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
    };
    stationStore.addReading(stationId, newReading);
    response.redirect('/station/' + stationId)
    },
};

module.exports = station;







 

