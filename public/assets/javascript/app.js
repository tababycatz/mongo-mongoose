// grab articles as json //
$.getJSON("/articles", function(data){

    // for each one //
    for (var i = 0; i < data.length; i++){

        //display information on page //
        $("#articles").append("<p data-id='" + data[i].id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

// at on click on p tag //
$(document).on("click", "p", function(){

    // empty notes from note section //
    $("#notes").empty();

    // save id from p tag //
    var thisId = $(this).attr("data-id");

    //make ajax call for article //
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })

    // add note info to page //
    .then(function(data) {
        console.log(data);
        
        // title of article //
        $("#notes").append("<h2>" + data.title + "</h2>");

        // input to enter new title //
        $("#notes").append("<input id='titleInput' name='title'>");

        // text area to add new note body //
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

        //button to submit new note, with article id saved to it //
        $("#notes").append("<button data-id='" + data.id + "'id='savenote'>Save Note</button>");

        // if there is note //
        if (data.note) {
            
            // place title of note in title input //
            $("#titleinput").val(data.note.title);

            // place body of note in the body text area //
            $("#bodyinput").val(data.note.body);
        }
    });
});

