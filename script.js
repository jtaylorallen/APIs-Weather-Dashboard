console.log('weather dashboard app');

//  global variables
var apikey = 'ce12d6753030b472f33593ed904442cf';

// current day variables
var userInput = $('#userInput').val();
// var buttonInfo = $('#buttonInfo').html();

// input HTML variable
var submitBtn = $('#submitBtn');
var btnSecondary = $('.btnSecondary');
var recentSearch = $('#recentSearch');

// one day weather variables
var day = $('#day');
var dayCity = $('#dayCity');
var dayCurrent = $('#dayCurrent');
var dayIcon = $('#dayIcon');
var dayTemp = $('#dayTemp');
var dayWind = $('#dayWind');
var dayHumidity = $('#dayHumidity');
var dayUV = $('#dayUV');

// five day weather variables
var fiveDayWeather = $('.fiveDayWeather');
var fiveDayDate = $('.fiveDayDate');
var fiveDayTemp = $('.fiveDayTemp');
var fiveDayPhoto = $('.fiveDayPhoto');
var fiveDayWind = $('.fiveDayWind');
var fiveDayHumidity = $('.fiveDayHumidity');

// javascript variables
var saveCity = [];


function getAPI() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${apikey}`)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data);
            dayCity.text(data.name);
            dayCurrent.text(moment().format('dddd, MMM, Do '));

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&units=imperial&appid=${apikey}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data2) {
                    console.log(data2.current.uvi)
                    dayUV.text(`UV Index: ${data2.current.uvi}`);
                    if (data2.current.uvi > 4) {
                        dayUV.css('background', '#F3C5A6')
                    } else if (data2.current.uvi > 2) {
                        dayUV.css('background', '#F2DABD')
                    } else {
                        dayUV.css('background', '#DAF1BB')
                    }

                    dayIcon.prepend("<img src=http://openweathermap.org/img/wn/" + data2.current.weather[0].icon + "@2x.png />");
                    dayTemp.text('Temp: ' + data2.current.temp + '°F');
                    dayWind.text('Wind: ' + data2.current.wind_speed + 'MPH');
                    dayHumidity.text('Humidity: ' + data2.current.humidity + '%');

                    fiveDayTemp.each(function(i) { $(this).text("Temp: " + data2.daily[i].temp.day) })
                    fiveDayWind.each(function(i) { $(this).text("Wind: " + data2.daily[i].wind_speed) })
                    fiveDayHumidity.each(function(i) { $(this).text("Humidity: " + data2.daily[i].humidity) })
                    fiveDayDate.each(function(i) { $(this).text(moment().add(1 + i, 'days').format("dddd")); });
                    fiveDayPhoto.each(function(i) { $(this).prepend("<img src=http://openweathermap.org/img/wn/" + data2.daily[i].weather[0].icon + "@2x.png />"); });
                })
        })
}
// ----------------------- local storage ----------------
// checks local storage to see if anything is in there and pulls it out and pushes into our array
function check() {
    if (localStorage.getItem("cities") != null) {
        return JSON.parse(localStorage.getItem("cities"))
    } else {
        return saveCity;
    }
}

function save() {
    saveCity = check(); // if stmnt from check function will GET local storage and push into our array called saveCity
    saveCity.unshift(userInput); // now order the new item into our array at the begining of it (index 0)

    if (saveCity.length > 5) {
        saveCity.pop(); // last search item is removed from end of array
        localStorage.setItem("cities", JSON.stringify(saveCity));
    } else {
        localStorage.setItem("cities", JSON.stringify(saveCity))
    }
}

function display() { // this is for search history buttons under my search bar
    saveCity = check();
    $.each(saveCity, function(i) {
        // var button = $('<button class = "btn btn-dark">/>'); 
        var button = $('<button class = "btn btn-secondary w-100">/>');
        //var button = $('<button class = "btn btn-secondary w-100">/>');
        //var div = $('<li/>');
        button.html(saveCity[i]);
        //button.append(button);
        recentSearch.append(button);
    })
}

function updateDiv() {
    recentSearch.html('');
    dayIcon.html('');
    fiveDayPhoto.html('');
}

submitBtn.click(function() {
    userInput = $('#userInput').val();
    updateDiv()
    getAPI();
    save();
    check();
    display();
})

recentSearch.click(function(event) {
    var eventTarget = $(event.target);
    userInput = eventTarget.text();
    //userInput = $('.btnSecondary').html();
    updateDiv()
    getAPI();
    save();
    check();
    display();
})

display();