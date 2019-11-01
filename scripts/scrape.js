var request = require('request');
var cheerio = require('cheerio');

var scrape = function(cb) {
    request ("http://reactjsnewsletter.com/", function(err, res, body){
        var $ = cheerio.load(body);
        var articles = [];
        $(".item item--issue item--link").each(function(i, element){
            var title = $(this).children(".item__title").text();
            var summ = $(this).children("p");
            var links = $(this).children("a").attr("href");
            var dataToAdd = {
              headline: title,
              summary: summ,
              link: links
            }
            
            articles.push(dataToAdd);
        });
        cb(articles);
    })
}

module.exports = scrape;
