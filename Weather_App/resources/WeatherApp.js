window.onload = function () {
    var ipUrl = "https://ipinfo.io/json";
    var appId = "appid=95176c8edea30e33338e0eaddd53a916";
    var location = document.getElementById("location");
    var currentDate = new Date(); //Display actual date
	var dayNight = "day";

    httpReqIpAsync(ipUrl);

    //setting the date
	var dateElem = document.getElementById("date");
    dateElem.innerHTML = currentDate.toDateString();

    // ipinfo.io API request for location
    function httpReqIpAsync(url, callback) {
        var httpReqIp = new XMLHttpRequest();
        httpReqIp.open("GET", url, true);
        httpReqIp.onreadystatechange = function () {
            if(httpReqIp.readyState == 4 && httpReqIp.status == 200) {
                var jsonIp = JSON.parse(httpReqIp.responseText);
                console.log(jsonIp);
                var city = jsonIp.city;
                var country = jsonIp.country;
                location.innerHTML = `${city}, ${country}`;
                var lat = jsonIp.loc.split(",")[0];
                var lon = jsonIp.loc.split(",")[1];
                var weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${appId}`;
                httpReqWeatherAsync(weatherUrl);
            }
        }
        httpReqIp.send();
    }

    // openweathermap.org api request
    function httpReqWeatherAsync(url, callback) {
        var httpReqWeather = new XMLHttpRequest();
        httpReqWeather.open("GET", url, true);
        httpReqWeather.onreadystatechange = function () {
            if(httpReqWeather.readyState == 4 && httpReqWeather.status == 200) {
                var jsonWeather = JSON.parse(httpReqWeather.responseText);
                console.log(jsonWeather);
                var description = jsonWeather.weather[0].description;
                var id = jsonWeather.weather[0].id;
                var temperature = jsonWeather.main.temp;
                var tempCelcius = Math.round(temperature - 273.15);
                var humidity = jsonWeather.main.humidity;
                var windSpeed = jsonWeather.wind.speed;
                var visibility = jsonWeather.visibility;
                var desc = document.getElementById("description");
                desc.innerHTML = `<i id="icon-desc" class="wi wi-owm-${id}"></id><p>${description}</p>`;
                var temp = document.getElementById("temperature");
                temp.innerHTML = `${tempCelcius}<i id="icon-thermometer" class="wi wi-thermometer"></i>`; 
                var humidityElem = document.getElementById("humidity");
				humidityElem.innerHTML = `${humidity}%`;
				var windElem = document.getElementById("wind");
				windElem.innerHTML = `${windSpeed * 1.6} km/h`;
				var visibilityElem = document.getElementById("visibility");
                visibilityElem.innerHTML = `${visibility * 1.6 / 1000} km`;
                
                //find whether is day or night
				var sunSet = jsonWeather.sys.sunset;
				//sunset is 10 digits and currentDate 13 so div by 1000
                var timeNow = Math.round(currentDate / 1000);
				console.log(timeNow + "<" + sunSet +" = "+(timeNow < sunSet))
				dayNight = (timeNow < sunSet) ? "day" : "night";

            }
        }
        httpReqWeather.send();
    }
}




