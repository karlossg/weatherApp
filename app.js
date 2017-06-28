var latitude, longitude; 
var fahrenheit, celsius;
var windKph, windMph, windDir;
var humidity;
var icon;
var country, city;
var localTime;

var App = {
  init: function() {
    this.getLocation();
  },
  getLocation: function () {
    window.onload = function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };
    function showPosition(position) {
      latitude = position.coords.latitude.toFixed(6);
      longitude = position.coords.longitude.toFixed(6);
      Helpers.getWeatherInfo();
      Helpers.getLocationName();
    }
  }
};

var Helpers = {
  getWeatherInfo: function () {
    fetch('https://api.apixu.com/v1/current.json?key=f6c5e0d601554c7d87c150909171406&q=' + latitude + ',' + longitude).then(function (response) {
      if (response.status !== 200) {
        console.log('There was a problemm with response. Status Code: ' + response.status);
        return;
      }
      response.json().then(function (data) {
        fahrenheit = data.current.temp_f;
        celsius = data.current.temp_c;
        icon = data.current.condition.icon;
        windKph = data.current.wind_kph;
        windMph = data.current.wind_mph;
        windDir = data.current.wind_dir;
        humidity = data.current.humidity;
        localTime = data.location.localtime;
      
        View.showTime();
        View.showIcon();
        View.showTemp();
        View.showWind();
        View.showHumidity();  
      });
    }).catch(function (err) {
      console.log('We got an error! :(', err);
    });
  },
  getLocationName: function () {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + "&language=en").then(function (response) {
      if (response.status !== 200) {
        console.log('There was a problemm with response. Status Code: ' + response.status);
        return;
      }
      response.json().then(function (data) {
        city = data.results[1].address_components[3].long_name;
        country = data.results[1].address_components[6].long_name;

        View.showLocation();       
      });
    }).catch(function (err) {
      console.log('We got an error! :(', err);
    });
  },
  swapMetricToImperial: function(div1, div2) {
    d1 = document.getElementById(div1);
    d2 = document.getElementById(div2);
    if (d2.style.display == "none") {
      d1.style.display = "none";
      d2.style.display = "block";
    } else {
      d1.style.display = "block";
      d2.style.display = "none";
    }
  }
};

var View = {
  showLocation: function() {
    var nameToHTML = document.getElementById('name');
    nameToHTML.innerHTML = "<img style='width: 15px;' src='maps-and-flags.png' alt='location pin icon'> " + city + ", " + country;
  },
  showTime: function() {
    var timeToHtml = document.getElementById('time');
    timeToHtml.innerHTML = "It's " + localTime;
  },
  showIcon: function() {  
    var iconToHtml = document.getElementById('icon');
    iconToHtml.innerHTML = '<img src="https://' + icon + '"' + 'alt="weather icon" >';
  },
  showTemp: function() {
    if (country === 'Bahamas' || country === 'United States of America' || country === 'Belize' || country === 'Cayman Islands') {
      var CelsiusToHTML = document.getElementById('swapper-temp-first');
      CelsiusToHTML.innerHTML = "Temp: " + fahrenheit + ' &#8457';
      CelsiusToHTML = document.getElementById('swapper-temp-other');
      CelsiusToHTML.innerHTML = "Temp: " + celsius + ' &#8451';
    } else {
        var fahrenheitToHTML = document.getElementById('swapper-temp-first');
        fahrenheitToHTML.innerHTML = "Temp: " + celsius + ' &#8451';
        fahrenheitToHTML = document.getElementById('swapper-temp-other');
        fahrenheitToHTML.innerHTML = "Temp: " + fahrenheit + ' &#8457';
    }
  },
  showWind: function() { 
    if (country === 'Bahamas' || country === 'United States of America' || country === 'Belize' || country === 'Cayman Islands' || country === 'United Kingdom' || country === 'American Samoa' || country === 'British Virgin Islands' || country === 'Dominica' || country === 'Falkland Islands' || country === 'Grenada' || country === 'Guam' || country === 'Myanmar' || country === 'Northern Mariana Islands' || country === 'Samoa' || country === 'Saint Lucia' || country === 'Saint Vincent and the Grenadines' || country === 'U.S. Virgin Islands' || country === 'Puerto Rico' || country === 'Turks and Caicos Islands' || country === 'Antigua and Barbuda' || country === 'Saint Helena' || country === ' Saint Kitts and Nevis') { 
      var windMphToHtml = document.getElementById('swapper-wind-first');
      windMphToHtml.innerHTML = "Wind: " + windDir + " " + windMph + " MPH";
      windMphToHtml = document.getElementById('swapper-wind-other');
      windMphToHtml.innerHTML = "Wind: " + windDir + " " + windKph + " km/h";
    } else {
        var windKphToHtml = document.getElementById('swapper-wind-first');
        windKphToHtml.innerHTML = "Wind: " + windDir + " " + windKph + " km/h";
        windKphToHtml = document.getElementById('swapper-wind-other');
        windKphToHtml.innerHTML = "Wind: " + windDir + " " + windMph + " MPH";
    }
  },
  showHumidity: function() {  
    var humidityToHtml = document.getElementById('humidity');
    humidityToHtml.innerHTML = "Humidity: " + humidity + " %";
  }
};

App.init();
