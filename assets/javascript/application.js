//creating a bands array that the user inputs will be dumped into
var bands = [];

//render a new button for each user input
function renderButtons() {
    //need this line of code to prevent repeat buttons
    $("#buttons-view").empty();
    //clears textbox
    $("#user-choice").val('');

    //looping through the array of bands
    for (var i = 0; i < bands.length; i++) {
        // Then dynamicaly generating buttons for each topic in the array
        var a = $("<button>");
        // Adding a class of band to our button
        a.addClass("band");
        // Adding a data-attribute
        a.attr("data-name", bands[i]);
        // Providing the initial button text
        a.text(bands[i]);
        // Adding the button to the HTML
        $("#buttons-view").append(a);

    }
}

// This function handles events where one button is clicked
$("#add-band").on("click", function(event) {
    // Preventing the buttons default behavior when clicked (which is submitting a form)
    event.preventDefault();
    // This line grabs the input from the textbox
    var band = $("#user-choice").val().trim();

    // Adding the input from the textbox to our array
   bands.push(band);
    // console.log(bands);

    // Calling renderButtons which handles the processing of our bands array
    renderButtons();

    

    //need to generate 10 gifs for each button pressed.
    //start by making an ajax call
    // Event listener for all button elements
    $("button").on("click", function() {
        // In this case, the "this" keyword refers to the button that was clicked
        var person = $(this).attr("data-name");
        // Constructing a URL to search Giphy for the input
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            person + "&api_key=dc6zaTOxFJmzC&limit=10";

        // Performing our AJAX GET request
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // After the data comes back from the API
            .done(function(response) {
                // Storing an array of results in the results variable
                var results = response.data;
                console.log(results);
                // Looping over every result item
                for (var i = 0; i < results.length; i++) {

                    // Only taking action if the photo has an appropriate rating
                    if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                        // Creating a div with the class "item"
                        var gifDiv = $("<div class='item'>");

                        // Storing the result item's rating
                        var rating = results[i].rating;

                        // Creating a paragraph tag with the result item's rating
                        var p = $("<p>").text("Rating: " + rating);

                        // Creating an image tag
                        var personImage = $("<img>");

                        // Giving the image tag an src attribute of a proprty pulled off the
                        // result item
                        personImage.attr("src", results[i].images.fixed_height_still.url);
                        personImage.attr("data-still", results[i].images.fixed_height_still.url);
                        personImage.attr("data-animate", results[i].images.fixed_height.url);
                        personImage.attr("data-state", "still");
                        personImage.attr("class", "gif");

                        // Appending the paragraph and personImage we created to the "gifDiv" div we created
                        gifDiv.append(p);
                        gifDiv.append(personImage);

                        // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
                        $("#gifs-appear-here").prepend(gifDiv);

                        $(".gif").on("click", function() {
                            // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
                            var state = $(this).attr("data-state");
                            // If the clicked image's state is still, update its src attribute to what its data-animate value is.
                            // Then, set the image's data-state to animate
                            // Else set src to the data-still value
                            if (state === "still") {
                                $(this).attr("src", $(this).attr("data-animate"));
                                $(this).attr("data-state", "animate");
                            } else {
                                $(this).attr("src", $(this).attr("data-still"));
                                $(this).attr("data-state", "still");
                            }
                        })

                    }
                }
            });
    });
});