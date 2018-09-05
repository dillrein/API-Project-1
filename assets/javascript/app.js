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



// ticketMasterApi = "YKxjTTGNYd3zG58GRyowVtUuQ4WLVhdd"

// Ticket Master API


function ticketMaster() {
    console.log("ticketMaster is called");
    var userInput = localStorage.getItem("city")

    var tmQueryURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=" + userInput + "&apikey=YKxjTTGNYd3zG58GRyowVtUuQ4WLVhdd"
    // console.log(tmQueryURL)

    $.ajax({
            url: tmQueryURL,
            method: "GET",

        })
        .then(function (response) {
            // console.log(response);


            //function areaResults() {
            for (i = 0; i < response._embedded.events.length; i++) {
                // console.log(i)
                var showsDiv = $("<div class='shows'>");

                //ARTIST NAME
                var artistName = response._embedded.events[i].name;
                var artistInfo = $("<p>").text(artistName);
                // console.log(artistName + " artist");

                //IMAGE
                var image = response._embedded.events[i].images[1].url;
                var imageInfo = $("<img>").attr("src", image);
                // console.log("image");

                //STREET ADDRESS
                eventAddress = response._embedded.events[i]._embedded.venues[0].address.line1;
                var addressInfo = $("<p>").text(eventAddress);
                console.log("This is event address in ticketMaster: " + eventAddress);


                //CITY
                var city = response._embedded.events[i]._embedded.venues[0].city.name;
                var cityInfo = $("<p>").text(city);
                // console.log(city + " city");

                //VENUE NAME
                var venueName = response._embedded.events[i]._embedded.venues[0].name;
                var venueInfo = $("<p>").text(venueName);
                // console.log(venueName + " venue name");

                //STATE
                var venueState = response._embedded.events[i]._embedded.venues[0].state.name;
                var state = $("<p>").text(venueState);
                // console.log(venueState + " state");



                showsDiv.append(imageInfo);
                showsDiv.append(artistInfo);
                showsDiv.append(addressInfo);
                showsDiv.append(cityInfo);
                showsDiv.append(venueInfo);
                showsDiv.append(state);


                // Putting the entire shows above the previous showss
                $("#drop").append(showsDiv);

            }

        });


}



//--------------------------- ARSALAN'S SCRIPT BEGINS ---------------------------
function initMap() {
    console.log("initmap is called");
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
    console.log("geocodeAddress is called");
    console.log("This is event address in geocode: " + eventAddress);
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
//--------------------------- ARSALAN'S SCRIPT ENDS ---------------------------


var eventAddress;

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