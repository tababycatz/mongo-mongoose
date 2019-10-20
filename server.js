// Dependencies //
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;

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

app.get("/scrape", function(req, res){
    axios.get("http://www.nytimes.com/").then(function(response){
        var $ = cheerio.load(response.data);
        $("article").each(function (i, element){
            var result = {};
            result.title = $(this).children("h2").text();
            result.link = $(this).children("a").attr("href");

            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });
        res.send("Scrape done!");
    });
});

app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });

});

app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});