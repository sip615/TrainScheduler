// Initialize Firebase
    var config = {
        apiKey: "AIzaSyDUwtOV4Tw7RWYn3vGu9yJtI-kFa57mU68",
        authDomain: "trainscheduler-32f44.firebaseapp.com",
        databaseURL: "https://trainscheduler-32f44.firebaseio.com",
        projectId: "trainscheduler-32f44",
        storageBucket: "trainscheduler-32f44.appspot.com",
        messagingSenderId: "556028589919"
    };
    firebase.initializeApp(config);
    var trainInfo = firebase.database();

//Event handler which runs on the click of the train button.
    $("#add-train-btn").on("click", function(event){
        event.preventDefault();
        var trainName = $("#train-name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTrain = $("#first-train-input").val().trim();
        var frequency = $("#frequency-input").val().trim();
    
//object to hold the train information.
        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        };
//Call a push method (with a newTrain argument) on the ref method on the trainInfo object which is the firebase database that we've linked above... To push the new train objects to firebase.
        trainInfo.ref().push(newTrain);

//log everything to the console to see if it works. Here I'm repeating console.log() many times. Not sure how to make that more D.R.Y.
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrain);
        console.log(newTrain.frequency);

//Alert (taken from the sample code).
        alert("Train Added!");

//Clear the info from the form (taken from the sample code).
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");
    });

    trainInfo.ref().on("child_added", function(childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());
        var tName = childSnapshot.val().name;
        var tDestination = childSnapshot.val().destination;
        var tFrequency = childSnapshot.val().frequency;
        var tFirstTrain = childSnapshot.val().firstTrain;
        var timeArr = tFirstTrain.split(":");
        var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
        var maxMoment = moment.max(moment(), trainTime);
        var tMinutes;
        var tArrival;

// If statement to determine if the first train is late or not. Set the arrival time to the first train time (from sample code).
        if (maxMoment === trainTime) {
            tArrival = trainTime.format("hh:mm A");
            tMinutes = trainTime.diff(moment(), "minutes");
        } else {
// Find the minutes until the train arrives.
// Subtract the FirstTrain time from th ecurrent time, and use the modulus operator on differentcTimes and tFrequency.
            var differenceTimes = moment().diff(trainTime, "minutes");
            var tRemainder = differenceTimes % tFrequency;
            tMinutes = tFrequency - tRemainder;
// Calculate the arrival time by adding tMinutes to the current time.
            tArrival = moment().add(tMinutes, "m").format("hh:mm A");
          }
//Log everything to see that it is working
          console.log("tMinutes:", tMinutes);
          console.log("tArrival:", tArrival);
//Add train info to the table.
          $("#train-table > tbody").append(
                $("<tr>").append(
                $("<td>").text(tName),
                $("<td>").text(tDestination),
                $("<td>").text(tFrequency),
                $("<td>").text(tArrival),
                $("<td>").text(tMinutes)
                )
          );
}); 