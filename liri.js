require("dotenv").config();

var keys = require("./keys.js");

// Import the API keys
var keys = require("./keys");

// Import the NPM packages
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// Initialize the spotify API
var spotify = new Spotify(keys.spotify);

// Switch case for terminal commands
var pick = function(caseData, functionData) {
    switch (caseData) {
        case "spotify-this-song":
        getSpotifySong(functionData);
        break;
        case "concert-this":
        findConcerts(functionData);
        break;
        case "movie-this":
        movies(functionData);
        break;
        case "do-what-it-says":
        doWhatItSays();
        break;
        default:
        console.log("LIRI doesn't know that");
    }
};

var getArtist = function(artist) {
    return artist.name;
};

// Function for running a Spotify search
var getSpotifySong = function(song) {

    spotify.search(
        {
        type: "track",
        query: song
        },
        function(err, data) {
            if (err) {
            console.log("Error occurred: " + err);
            return;
            }
  
            var songs = data.tracks.items;
    
            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("Artist(s): " + songs[i].artists.map(getArtist));
                console.log("Song ID: " + songs[i].name);
                console.log("Preview Track: " + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        } 
    );
};


// Fuction to find concerts
var findConcerts = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(
        function(response) {
            var jsonData = response.data;
    
            if (!jsonData.length) {
            console.log('\n' +"No available shows found for: " + artist + '\n');
            return;
            }
  
            console.log('\n' + "Upcoming concerts for " + artist + ":" +'\n');
  
            for (var i = 0; i < jsonData.length; i++) {
                var show = jsonData[i];
  
                console.log(
                    "* " + show.venue.city + "," + (show.venue.region || show.venue.country) +
                    " at " +show.venue.name + " " + moment(show.datetime).format("MM/DD/YYYY"));
                console.log("-----------------------------------");
            }
        }
    );
  };
  
  // Function for running a Movie Search
var movies = function(movieName) {
  
    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    axios.get(urlHit).then(
        function(response) {
            var jsonData = response.data;
    
            console.log('\n'+"Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value + '\n');
        }
    );
};
  
  // Function for running a command based on text file
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
    
        var dataArr = data.split(",");
    
        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));
  