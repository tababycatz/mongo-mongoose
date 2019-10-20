//Dependencies//
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var PORT = process.env.PORT || 3000;
var app = express();
var router = express.Router();

app.use(express.static(__dirname + "/public"));
app.use(router);
var db = process.eng.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(db, function(error){
    if(error) {
        console.log(error);
    } else {
        console.log("mongoose is good to go")
    }
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});