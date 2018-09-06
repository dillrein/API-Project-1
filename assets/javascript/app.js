//search button event handler
$(".material-icons").on("click", function (event) {
    //event.preventDefault()
    var inputValue = $('#search').val()
    //console.log(inputValue);
    if (inputValue !== '') {
        //console.log(inputValue);
        //grabbing input from search bar
        var userInput = $("#search").val().trim();
        //console.log(userInput);

        // Clear absolutely everything stored in localStorage using localStorage.clear()
        localStorage.clear();

        // Store the username into localStorage using "localStorage.setItem"
        localStorage.setItem("city", userInput);

        $("#enter-link").attr('href', "search.html");
    } else {
        //console.log('Please enter City');
        $("#search").attr('placeholder', 'Please enter City');
    }

});


//----------------------------------Ticket Master-----------------------------
function ticketMaster() {
    //console.log("ticketMaster is called");
    var userInput = localStorage.getItem("city")

    var tmQueryURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=" + userInput + "&radius=20&unit=miles&apikey=YKxjTTGNYd3zG58GRyowVtUuQ4WLVhdd"
    // console.log(tmQueryURL)

    $.ajax({
        url: tmQueryURL,
        method: "GET",

    })
        .then(function (response) {
            console.log(response);


            //function areaResults() {
            for (i = 0; i < 10; i++) {
                // console.log(i)
                var showsDiv = $("<div class='shows'>");

                //ARTIST NAME
                var artistName = response._embedded.events[i].name;
                var artistInfo = $("<p>").text(artistName).attr('style', 'font-weight:bold');
                // console.log(artistName + " artist");

                //IMAGE
                var image = response._embedded.events[i].images[1].url;
                var imageInfo = $("<img>").attr("src", image);
                // console.log("image");

                //STREET ADDRESS
                eventAddress = response._embedded.events[i]._embedded.venues[0].address.line1;
                var addressInfo = $("<p>").text(eventAddress);
                //console.log("This is event address in ticketMaster: " + eventAddress);


                //CITY
                var city = response._embedded.events[i]._embedded.venues[0].city.name;
                // console.log(city + " city");

                //VENUE NAME
                var venueName = response._embedded.events[i]._embedded.venues[0].name;
                var venueInfo = $("<p>").text(venueName);
                // console.log(venueName + " venue name");

                //STATE
                var venueState = response._embedded.events[i]._embedded.venues[0].state.name;
                var state = $("<p>").text(city + ", " + venueState);
                // console.log(venueState + " state");

                //TM website link to purchase tickets
                var tickets = response._embedded.events[i].url
                var urlTickets = $("<a>").attr("href", tickets).text("Buy Tickets");
                //console.log(tickets);

                //Date
                var date = response._embedded.events[i].dates.start.dateTime
                var dateFormat = "YYYY-MM-DDT00:00:00Z"
                var newDate = moment(date, dateFormat).format('MMMM Do YYYY');
                var eventDate = $("<p>").text(newDate);



                showsDiv.append(imageInfo);
                showsDiv.append(artistInfo);
                showsDiv.append(addressInfo);
                showsDiv.append(state);
                showsDiv.append(venueInfo);
                showsDiv.append(eventDate);
                showsDiv.append(urlTickets);


                // Putting the entire shows above the previous shows
                $("#drop").append(showsDiv);

            }

        });


}


//--------------------------- GOOGLE BEGINS ---------------------------
function initMap() {
    //console.log("initmap is called");
    var map = new google.maps.Map(document.getElementById('mapDiv'), {
        zoom: 15,
        center: {
            lat: 33.684566,
            lng: -117.826508
        }
    });
    var geocoder = new google.maps.Geocoder();

    // 
    geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
    //var inputAddress = eventAddress;
    //console.log("geocodeAddress is called");
    //console.log("This is event address in geocode: " + eventAddress);
    geocoder.geocode({
        'address': inputAddress
    }, function (results, status) {
        if (status === 'OK') {
            // .geometry.location property contains a LatLng object, refering the place 
            // we searched for. Retrieve it and assign it to the map's center 
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
//--------------------------- GOOGLE ENDS ---------------------------

//saving as global variable to access in google and tm
var eventAddress;


//-------------------------------FIREBASE------------------------------
//firebase and page 3 functionality
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDAB7Z37OYpxZk10-q4irdQvrQ1n7WLM9E",
    authDomain: "group-project-1-fbce8.firebaseapp.com",
    databaseURL: "https://group-project-1-fbce8.firebaseio.com",
    projectId: "group-project-1-fbce8",
    storageBucket: "group-project-1-fbce8.appspot.com",
    messagingSenderId: "114536344919"
};
firebase.initializeApp(config);

var database = firebase.database();

//user input and gathering it.
$("#addUser").on("click", function (event) {
    //form information
    var userName = $("#nameInput").val().trim();
    var userLast = $("#lastInput").val().trim();
    var userEmail = $("#emailInput").val().trim();
    var userCity = $("#cityInput").val().trim();
    var userMess = $("#message").val().trim();

    var savedInfo = {
        firstName: userName,
        lastName: userLast,
        email: userEmail,
        city: userCity,
        message: userMess
    };

    database.ref().push(savedInfo);
    // Clears all of the text-boxes
    $("#nameInput").val("");
    $("#lastInput").val("");
    $("#emailInput").val("");
    $("#cityInput").val("");
    $("#userMess").val("");

});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    //creating variable that takes info from database
    var userName = childSnapshot.val().firstName;
    var userLast = childSnapshot.val().lastName;
    var userEmail = childSnapshot.val().email;
    var userCity = childSnapshot.val().city;
    var userMess = childSnapshot.val().message;

    // console check
    console.log(userName);
    console.log(userLast);
    console.log(userEmail);
    console.log(userCity);
    console.log(userMess)


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(userName),
        $("<td>").text(userLast),
        $("<td>").text(userEmail),
        $("<td>").text(userCity),
        $("<td>").text(userMess),

    );

    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
});
