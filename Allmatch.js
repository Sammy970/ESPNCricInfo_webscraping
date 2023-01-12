const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const scorecardObj = require("./scorecard");

function getAllMatchesLink(url) {
    request(url, function (err, response, html) {
        if (err) {
            console.log(err);
        } else {
            getAll(html);
        }
    })
}

function getAll(html) {
    let $ = cheerio.load(html);
    let scorecardElems = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent > a");
    for (let i = 0; i < scorecardElems.length; i++) {
        let link = $(scorecardElems[i]).attr("href");
        // console.log(link);
        let fullLink = "https://www.espncricinfo.com" + link;
        console.log(fullLink);
        scorecardObj.ps(fullLink);


    }
}

module.exports = {
    gAllMatches: getAllMatchesLink
}