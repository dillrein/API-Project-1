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

// An array to hold each venue street address upon being received from the server 
var addressArr = [];

function ticketMaster() {
    // Checking to see if ticketMaster() has been called
    //console.log("TICKET MASTER IS CALLED");
    var userInput = localStorage.getItem("city")

    var tmQueryURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=" + userInput + "&radius=20&unit=miles&apikey=YKxjTTGNYd3zG58GRyowVtUuQ4WLVhdd"
    // console.log(tmQueryURL)

    $.ajax({
        url: tmQueryURL,
        method: "GET",

    })
        .then(function (response) {
           // console.log(response);

            // Making sure the response does contain data
            if (response._embedded !== undefined) {
                for (i = 0; i < response._embedded.events.length; i++) {
                    var showsDiv = $("<div class='shows'>");

                    //ARTIST NAME
                    if (response._embedded.events[i].name !== undefined) {
                        var artistName = response._embedded.events[i].name;
                        var artistInfo = $("<p>").text(artistName);
                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "ARTIST NAME"');
                    }

                    //IMAGE
                    if (response._embedded.events[i].images[1] !== undefined) {
                        var image = response._embedded.events[i].images[1].url;
                        var imageInfo = $("<img>").attr("src", image);
                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "IMAGE"');
                    }

                    //STREET ADDRESS
                    if (response._embedded.events[i]._embedded.venues[0].address !== undefined) {
                        var eventAddress = response._embedded.events[i]._embedded.venues[0].address.line1;
                        var addressInfo = $("<p>").text(eventAddress);
                        //console.log("Event#" + i)
                        //console.log("STREET: " + eventAddress);
                        addressArr.push(eventAddress);
                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "STREET ADDRESS"');
                    }


                    //CITY
                    if (response._embedded.events[i]._embedded.venues[0].city !== undefined) {
                        var city = response._embedded.events[i]._embedded.venues[0].city.name;
                        //var cityInfo = $("<p>").text(city);
                        //console.log("CITY: " + city);
                    } else {
                        //console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "CITY"');
                    }


                    //VENUE NAME
                    if (response._embedded.events[i]._embedded.venues[0].name !== undefined) {
                        var venueName = response._embedded.events[i]._embedded.venues[0].name;
                        var venueInfo = $("<p>").text(venueName);
                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY VENUE "NAME"');
                    }

                    //STATE
                    if (response._embedded.events[i]._embedded.venues[0].state !== undefined) {
                        var venueState = response._embedded.events[i]._embedded.venues[0].state.name;
                        var state = $("<p>").text(city + ", " + venueState);
                        //console.log(venueState + " state");

                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "STATE"');
                    }

                    //TM website link to purchase tickets
                    if (response._embedded.events[i].url !== undefined) {
                        var tickets = response._embedded.events[i].url
                        var urlTickets = $("<a>").attr("href", tickets).text("Buy Tickets");
                        //console.log(tickets);

                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "tickets"');
                    }

                    //Date
                    if (response._embedded.events[i].url !== undefined) {
                        var date = response._embedded.events[i].dates.start.dateTime
                        var dateFormat = "YYYY-MM-DDT00:00:00Z"
                        var newDate = moment(date, dateFormat).format('MMMM Do YYYY');
                        var eventDate = $("<p>").text(newDate);
                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "tickets"');
                    }

                    showsDiv.append(imageInfo);
                    showsDiv.append(artistInfo);
                    showsDiv.append(addressInfo);
                    showsDiv.append(state);
                    showsDiv.append(venueInfo);
                    showsDiv.append(eventDate);
                    showsDiv.append(urlTickets);

                    // Putting the entire shows above the previous shows
                    $("#drop").append(showsDiv);

                   // console.log("\n");

                } // End of for 
            } // End of if()
            else {

                throw ("NO RECORD HAS BEEN RECEIVED!");
            }

            // This is the end of "for loop"
            //console.log("End of foor loop");
            // Calling geocoder right upon finishing the for loop     
            for (i = 0; i < 10; i++) {
                console.log("EVENT#" + i + " ADDRESS FROM ARRAY: " + addressArr[i]);
                geocodeAddress(addressArr[i]);
            }

        })
}; // End of AJAX

// End of ticketMaster()


var map;

function initMap() {
    //console.log("INITMAP IS CALLED");
    map = new google.maps.Map(document.getElementById('mapDiv'), {
        zoom: 10,
        center: {
            lat: 33.640495,
            lng: -117.844299
        }
    });
} // End of initMap()

function geocodeAddress(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === 'OK') {
            // .geometry.location property contains a LatLng object, refering the place 
            // we searched for. Retrieve it and assign it to the map's center 
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


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
    //var userLast = $("#lastInput").val().trim();
    var userEmail = $("#emailInput").val().trim();
    var userCity = $("#cityInput").val().trim();
    var userMess = $("#message").val().trim();

    var savedInfo = {
        firstName: userName,
        //lastName: userLast,
        email: userEmail,
        city: userCity,
        message: userMess
    };

    database.ref().push(savedInfo);
    // Clears all of the text-boxes
    $("#nameInput").val("");
    //$("#lastInput").val("");
    $("#emailInput").val("");
    $("#cityInput").val("");
    $("#userMess").val("");

});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    //creating variable that takes info from database
    var userName = childSnapshot.val().firstName;
    //var userLast = childSnapshot.val().lastName;
    var userEmail = childSnapshot.val().email;
    var userCity = childSnapshot.val().city;
    var userMess = childSnapshot.val().message;

    // console check
    console.log(userName);
    //console.log(userLast);
    console.log(userEmail);
    console.log(userCity);
    console.log(userMess)


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(userName),
       // $("<td>").text(userLast),
        $("<td>").text(userEmail),
        $("<td>").text(userCity),
        $("<td>").text(userMess),

    );
    console.log("this is a new row", newRow);

    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
});
