"use strict"

const logger = require('../utils/logger');
const stationStore = require('../models/station-store.js');
const _ = require('lodash');

const uuid = require('uuid');




const stationAnalytics = {
  
 //Method to get the last reading from a station 
  
  getLastReading(station) {
    let lastReading = null;
    if(station.readings.length > 0) {
      lastReading = station.readings[(station.readings.length -1)];
    }
    return lastReading;
  },
  
/* weatherIcon(request) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId); 
    const lastReading = stationAnalytics.getLastReading(station);
    const weatherIcon = null;
    if(lastReading.code > 0) {
   if (lastReading.code == 100)  { weatherIcon = "sun"; }
  else if(lastReading.code == 200) { weatherIcon = "cloud sun"; }
  else if(lastReading.code == 300) { weatherIcon = "cloud"; }
  else if(lastReading.code == 400) { weatherIcon = "cloud sun rain"; }
  else if(lastReading.code == 500) { weatherIcon = "cloud rain"; }
  else if(lastReading.code == 600) { weatherIcon = "cloud rain"; }
  else if(lastReading.code == 700) { weatherIcon = "snowflake"; }
  else if(lastReading.code == 800) { weatherIcon = "bolt icon"; }
    }
   return weatherIcon;
 },
*/  
  //Utility method to translate weather codes into human readable weather descriptions
  
  getWeatherCode(request) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId); 
    const lastReading = stationAnalytics.getLastReading(station);
       let doWeather = null;
       let dynamicIcon = "cloud";
       let dynamicIconColour = "red";
    if(lastReading.code > 0) {
   if (lastReading.code == 100)  { doWeather = "Clear"; dynamicIcon = "cloud sun"; dynamicIconColour = "red"}
  else if(lastReading.code == 200) {doWeather = "Partial Clouds"; dynamicIcon = "cloud"; dynamicIconColour = "yellow" }
  else if(lastReading.code == 300) {doWeather = "Cloudy";  dynamicIcon = "cloud"; dynamicIconColour = "blue"}
  else if(lastReading.code == 400) {doWeather = "Light Showers"; dynamicIcon = "cloud rain"; dynamicIconColour = "green" }
  else if(lastReading.code == 500) {doWeather = "Heavy Showers"; dynamicIcon = "cloud rain"; dynamicIconColour = "purple"}
  else if(lastReading.code == 600) {doWeather = "Rain"; dynamicIcon = "cloud showers heavy"; dynamicIconColour = "pink"}
  else if(lastReading.code == 700) {doWeather = "Snow"; dynamicIcon = "snowflake"; dynamicIconColour = "grey"}
  else if(lastReading.code == 800) {doWeather = "Thunder"; dynamicIcon = "bolt"; dynamicIconColour = "orange"}
  else if(lastReading.code == 145) {doWeather = "It's raining men! Hallelujah!"; dynamicIcon = "cloud meatball"; dynamicIconColour = "red"}    
  else if(lastReading.code % 100 != 0 && lastReading.code != 145) { doWeather = "Invalid Code Entered"}
  }
  return doWeather;
  return dynamicIcon;
  return dynamicIconColour;
  },
  
  //Method to convert wind speeds to beaufort numbers 
  
  getBeaufort(request) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const lastReading = stationAnalytics.getLastReading(station);
    let beaufort = null;
    if(lastReading.windSpeed > 0) {
    if (lastReading.windSpeed == 0) {
      beaufort = 0;
    } else if (lastReading.windSpeed >= 1 && lastReading.windSpeed <= 6) {
      beaufort = 1;
    } else if (lastReading.windSpeed >= 7 && lastReading.windSpeed <= 11) {
      beaufort = 2;
    } else if (lastReading.windSpeed >= 12 && lastReading.windSpeed <= 19) {
      beaufort = 3;
    } else if (lastReading.windSpeed >= 20 && lastReading.windSpeed <= 29) {
      beaufort = 4;
    } else if (lastReading.windSpeed >= 30 && lastReading.windSpeed <= 39) {
      beaufort = 5;
    } else if (lastReading.windSpeed >= 40 && lastReading.windSpeed <= 50) {
      beaufort = 6;
    } else if (lastReading.windSpeed >= 51 && lastReading.windSpeed <= 62) {
      beaufort = 7;
    } else if (lastReading.windSpeed >= 63 && lastReading.windSpeed <= 75) {
      beaufort = 8;
    } else if (lastReading.windSpeed >= 76 && lastReading.windSpeed <= 87) {
      beaufort = 9;
    } else if (lastReading.windSpeed >= 88 && lastReading.windSpeed <= 102) {
      beaufort = 10;
    } else if (lastReading.windSpeed >= 103 && lastReading.windSpeed <= 117) {
      beaufort = 11;
    } else if (lastReading.windSpeed >= 117) {
      beaufort = 12;
    }
    
  }
    return beaufort;
  },
  
  //Method for converting from Celsius to Farenheit
  
  tempConversion(request) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const lastReading = stationAnalytics.getLastReading(station);
    let tempInFarenheit = null;
    if(lastReading.temp > 0) {
    tempInFarenheit = ((lastReading.temp * 1.8) + 32).toFixed(2);
    }
    return tempInFarenheit;
  },
  
  //Method for calculating Wind Chill
  
  windChill(request) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const lastReading = stationAnalytics.getLastReading(station);
    let windChill = null;
    if(lastReading.windSpeed > 0) {
    windChill = ((13.12 + (0.6215 * lastReading.temp) - (11.37*Math.pow((lastReading.windSpeed), 0.16))) + (0.3965 * lastReading.temp)*Math.pow(lastReading.windSpeed, 0.16)).toFixed(2);//*100)/100.0;
    }
    
   return windChill;
  },
  
  
 
  
  //Method for calculating wind direction e.g North East
  
  windCompass(request) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const lastReading = stationAnalytics.getLastReading(station);
    let windCompass = null;
    if(lastReading.windDirection > 0) {
        if((lastReading.windDirection>=348.75)&&(lastReading.windDirection<=11.25))
        {
            windCompass = "N";
        }
        if((lastReading.windDirection>=11.25)&&(lastReading.windDirection<=33.75))
        {
            windCompass = "NNE";
        }
        if((lastReading.windDirection>=33.75)&&(lastReading.windDirection<=56.25))
        {
            windCompass = "NE";
        }
        if((lastReading.windDirection>=56.25)&&(lastReading.windDirection<=78.75))
        {
            windCompass = "ENE";
        }
        if((lastReading.windDirection>=78.75)&&(lastReading.windDirection<=101.25))
        {
            windCompass = "E";
        }
        if((lastReading.windDirection>=101.25)&&(lastReading.windDirection<=123.75))
        {
            windCompass = "ESE";
        }
        if((lastReading.windDirection>=123.75)&&(lastReading.windDirection<=146.25))
        {
            windCompass = "SE";
        }
        if((lastReading.windDirection>=146.25)&&(lastReading.windDirection<=168.75))
        {
            windCompass = "SSE";
        }
        if((lastReading.windDirection>=168.75)&&(lastReading.windDirection<=191.25))
        {
            windCompass = "S";
        }
        if((lastReading.windDirection>=191.25)&&(lastReading.windDirection<=213.75))
        {
            windCompass = "SSW";
        }
        if((lastReading.windDirection>=213.75)&&(lastReading.windDirection<=236.25))
        {
            windCompass = "SW";
        }
        if((lastReading.windDirection>=236.25)&&(lastReading.windDirection<=258.75))
        {
            windCompass = "WSW";
        }
        if((lastReading.windDirection>=258.75)&&(lastReading.windDirection<=281.25))
        {
            windCompass = "W";
        }
        if((lastReading.windDirection>=281.25)&&(lastReading.windDirection<=303.75))
        {
            windCompass = "WNW";
        }
        if((lastReading.windDirection>=303.75)&&(lastReading.windDirection<=326.25))
        {
            windCompass = "NW";
        }
        if((lastReading.windDirection>=326.25)&&(lastReading.windDirection<=348.75))
        {
            windCompass = "NNW";
        }
    }
    return windCompass;
  },
  
  // The following group of methods are used to get the min and max values of each station for each respective element in said station
  
  minTemp(station) {
    let minTemp = null;
    if (station.readings.length > 0) {
      minTemp = station.readings[0];
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].temp < minTemp.temp) {
          minTemp = station.readings[i];
        }
      }
    }
    return minTemp;
  },
  
   maxTemp(station) {
    let maxTemp = null;
    if (station.readings.length > 0) {
      maxTemp = station.readings[0];
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].temp > maxTemp.temp) {
          maxTemp = station.readings[i];
        }
      }
    }
    return maxTemp;
  },
  
  minWindSpeed(station) {
    let minWindSpeed = null;
    if (station.readings.length > 0) {
      minWindSpeed = station.readings[0];
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].windSpeed < minWindSpeed.windSpeed) {
          minWindSpeed = station.readings[i];
        }
      }
    }
    return minWindSpeed;
  },
  
   maxWindSpeed(station) {
    let maxWindSpeed = null;
    if (station.readings.length > 0) {
      maxWindSpeed = station.readings[0];
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].windSpeed > maxWindSpeed.windSpeed) {
          maxWindSpeed = station.readings[i];
        }
      }
    }
    return maxWindSpeed;
  },
   
   minPressure(station) {
    let minPressure = null;
    if (station.readings.length > 0) {
      minPressure = station.readings[0];
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].windSpeed < minPressure.windSpeed) {
          minPressure = station.readings[i];
        }
      }
    }
    return minPressure;
  },
  
   maxPressure(station) {
    let maxPressure = null;
    if (station.readings.length > 0) {
      maxPressure = station.readings[0];
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].windSpeed > maxPressure.windSpeed) {
          maxPressure = station.readings[i];
        }
      }
    }
    return maxPressure;
  },
  
  
};
    

  
  



module.exports = stationAnalytics
