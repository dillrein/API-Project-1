//search button event handler
$(".material-icons").on("click", function (event) {
    //event.preventDefault()
    var inputValue = $('#search').val()
    //console.log(inputValue);
    if (inputValue !== '') {
        console.log(inputValue);
        //grabbing input from search bar
        var userInput = $("#search").val().trim();
        //console.log(userInput);

        // Clear absolutely everything stored in localStorage using localStorage.clear()
        localStorage.clear();

        // Store the username into localStorage using "localStorage.setItem"
        localStorage.setItem("city", userInput);

        $("#enter-link").attr('href', "search.html");
    } else {
        console.log('Please enter City');
        $("#search").attr('placeholder', 'Please enter City');
    }

});



// An array to hold each venue street address upon being received from the server 
var addressArr = [];

function ticketMaster() {
    // Checking to see if ticketMaster() has been called
    console.log("TICKET MASTER IS CALLED");
    var userInput = localStorage.getItem("city")

    var tmQueryURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=" + userInput + "&apikey=YKxjTTGNYd3zG58GRyowVtUuQ4WLVhdd"
    // console.log(tmQueryURL)

    $.ajax({
            url: tmQueryURL,
            method: "GET",

        })
        .then(function (response) {

            // Checking to see if the AJAX request has been made 
            console.log("AJAX IS CALLED");

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
                        console.log("Event#" + i)
                        console.log("STREET: " + eventAddress);
                        addressArr.push(eventAddress);
                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "STREET ADDRESS"');
                    }


                    //CITY
                    if (response._embedded.events[i]._embedded.venues[0].city !== undefined) {
                        var city = response._embedded.events[i]._embedded.venues[0].city.name;
                        var cityInfo = $("<p>").text(city);
                        console.log("CITY: " + city);
                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "CITY"');
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
                        var state = $("<p>").text(venueState);
                        console.log("STATE: " + venueState);
                    } else {
                        console.log('ERROR: THIS RECORD DOES NOT HAVE ANY "STATE"');
                    }

                    showsDiv.append(imageInfo);
                    showsDiv.append(artistInfo);
                    showsDiv.append(addressInfo);
                    showsDiv.append(cityInfo);
                    showsDiv.append(venueInfo);
                    showsDiv.append(state);

                    // Putting the entire shows above the previous showss
                    $("#drop").append(showsDiv);

                    console.log("\n");

                } // End of for 
            } // End of if()
            else {

                throw ("NO RECORD HAS BEEN RECEIVED!");
            }
            //--------------------------- ARSALAN'S SCRIPT BEGINS ---------------------------   
            // This is the end of "for loop"
            console.log("End of foor loop");
            // Calling geocoder right upon finishing the for loop     
            for (i = 0; i < addressArr.length; i++) {
                console.log("EVENT#" + i + " ADDRESS FROM ARRAY: " + addressArr[i]);
                window.setTimeout(geocodeAddress(addressArr[i]), 1000);
            }
            //--------------------------- ARSALAN'S SCRIPT ENDS ---------------------------
        }); // End of AJAX
} // End of ticketMaster()

//--------------------------- ARSALAN'S SCRIPT BEGINS ---------------------------
var map;

function initMap() {
    console.log("INITMAP IS CALLED");
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
   
    geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
    //var inputAddress = eventAddress;
    console.log("geocodeAddress is called");
    console.log("This is event address in geocode: " + eventAddress);
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
//--------------------------- ARSALAN'S SCRIPT ENDS ---------------------------



//firebase
// var config = {
//     apiKey: "AIzaSyBSg8DTI13_GdJd3GbIff1LoyPEwtuybxE",
//     authDomain: "api-project-4f920.firebaseapp.com",
//     databaseURL: "https://api-project-4f920.firebaseio.com",
//     projectId: "api-project-4f920",
//     storageBucket: "api-project-4f920.appspot.com",
//     messagingSenderId: "101719166373"
//   };



//   firebase.initializeApp(config)
