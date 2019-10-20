// Dependencies //
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// require all models //
var db = require("./models");
var PORT = 3000;

// initialize express //
var app = express();

// Use morgan logger for logging requests //
app.use(logger("dev"));
// Parse request body as JSON //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder //
app.use(express.static("public"));

// Connect to Mongo DB //
mongoose.connect("mongodb://localhost/mongoScrape", { useNewUrlParser: true });

// Routes //

app.get("/", function(req, res) {
    res.send("Good to go!");
  });

 // GET route for scraping website // 
app.get("/scrape", function(req, res){

    // grab body of html with axios //
    axios.get("http://www.nytimes.com/").then(function(response){

        // load into cheerio and save it to $ for shorthand selector //
        var $ = cheerio.load(response.data);

        // grab every article tag //
        $("article").each(function (i, element){

            // save in empty result object ..
            var result = {};

            // add text and href of every link, save them as properties of result object //
            result.title = $(this).children("h2").text();
            result.link = $(this).children("a").attr("href");

            // create new article using 'result' object built from scraping //
            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
            })

            // log if error occured //
            .catch(function(err){
                console.log(err);
            });
        });

        // notifies client of completion //
        res.send("Scrape done!");
    });
});

// route for getting all articles from db //
app.get("/articles", function(req, res){

    //grab every document in articles collection //
    db.Article.find({})
    .then(function(dbArticle){

        // if succesful in finding articles, send them back to client //
        res.json(dbArticle);
    })

    .catch(function(err){

        // if not, send to client //
        res.json(err);
    });

});

// route for grabbing a specific article by id, populate it with it's note //
app.get("/articles/:id", function(req, res) {

    // using the id passed in the id parameter, prepare a query that finds the matching one in our db... //
    db.Article.findOne({ _id: req.params.id })

      // populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {

        // if we were able to successfully find an Article with the given id, send it back to the client //
        res.json(dbArticle);
      })
      .catch(function(err) {

        // if not, send to client //
        res.json(err);
      });
  });
  
  // route for saving/updating an Article's associated Note //
  app.post("/articles/:id", function(req, res) {

    // create a new note and pass the req.body to the entry //
    db.Note.create(req.body)
      .then(function(dbNote) {

        // if a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note //
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default //
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query //
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {

        // If we were able to successfully update an Article, send it back to the client //
        res.json(dbArticle);
      })
      .catch(function(err) {

        // If not, send to client //
        res.json(err);
      });
  });

  // start server //
app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});