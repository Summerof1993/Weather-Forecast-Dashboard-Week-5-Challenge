var apiKey = "e8cd09669a356897141d042d684b0a30"

var cityFormEL = document.querySelector("#city-form");
var cityNameInputEL = document.querySelector("#city-name");
var submitEl = document.querySelector("#submit-button");
var mainContainer = document.querySelector("#main-container");
var todayContainer = document.querySelector("#today-container");
var fiveDayContainer = document.querySelector("#five-day-container");
var fiveDayInnerContainer = document.querySelector("#five-day-inner-container");

var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityNameInputEL.value.trim()

    if (cityName) {
        console.log(cityName);
        fiveDayInnerContainer.textContent = "";
        todayContainer.textContent = "";
        getCoordinates(cityName);
    } else {
        alert("Type a valid city name")
    }
}

var getCoordinates = function (cityName) {
    var coordinatesURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",US&limit=1&appid=" + apiKey;

    fetch(coordinatesURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data[0].lon.toFixed(4));
                console.log(data[0].lat.toFixed(4));
                var latitude = data[0].lat;
                var longitude = data[0].lon;

                getWeather(latitude, longitude);
            })
        } else {
            alert("Error " + response.statusText);
        }
    }
    )
}

var getWeather = function (latitude, longitude) {
    var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;

    fetch(weatherURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);

                var city = document.createElement("h3");
                city.textContent = data.city.name;
                todayContainer.append(city);

                var icon = data.list[0].weather[0].icon;
                var iconEL = document.createElement("img");
                iconEL.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + ".png")
                todayContainer.append(iconEL);

                var todayTemp = data.list[0].main.temp;
                var todayTempEL = document.createElement("p");
                todayTempEL.textContent = "Today's Temperature: " + todayTemp;
                todayContainer.append(todayTempEL);

                var todayHumidity = data.list[0].main.humidity + "%";
                var todayHumidityEL = document.createElement("p")
                todayHumidityEL.textContent = "Humidity: " + todayHumidity;
                todayContainer.append(todayHumidityEL);

                var todayWindSpeed = data.list[0].wind.speed + "MPH";
                var todayWindSpeedEL = document.createElement("p")
                todayWindSpeedEL.textContent = "WindSpeed: " + todayWindSpeed;
                todayContainer.append(todayWindSpeedEL);

                var newArray = getEveryNthIndex(data.list, 8);
                console.log(newArray);

                fiveDayContainer.classList.remove("hidden");

                for (var i = 0; i < newArray.length; i++) {

                    var div = document.createElement("div")
                    div.classList.add("card-styling");

                    var date = newArray[i].dt_txt;
                    var dateEL = document.createElement("h3");
                    dateEL.textContent = date;
                    div.append(dateEL);

                    var icon = newArray[i].weather[0].icon;
                    var iconEL = document.createElement("img");
                    iconEL.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + ".png")
                    div.append(iconEL);

                    var todayTemp = newArray[i].main.temp;
                    var todayTempEL = document.createElement("p");
                    todayTempEL.textContent = "Temperature: " + todayTemp;
                    div.append(todayTempEL);

                    var todayHumidity = newArray[i].main.humidity + "%";
                    var todayHumidityEL = document.createElement("p")
                    todayHumidityEL.textContent = "Humidity: " + todayHumidity;
                    div.append(todayHumidityEL);

                    var todayWindSpeed = newArray[i].wind.speed + "MPH";
                    var todayWindSpeedEL = document.createElement("p")
                    todayWindSpeedEL.textContent = "WindSpeed: " + todayWindSpeed;
                    div.append(todayWindSpeedEL);

                    fiveDayInnerContainer.append(div);
                }
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
}

cityFormEL.addEventListener("submit", formSubmitHandler)

var getEveryNthIndex = function (array, nth) {
    var resultArray = [];
    for (var i = 8; i < array.length; i += nth) {
        resultArray.push(array[i]);
    }
    return resultArray;
}
