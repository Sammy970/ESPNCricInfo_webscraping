// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

// const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";

const url = "https://www.espncricinfo.com/series/sri-lanka-in-india-2022-23-1348629";

// const url = "https://www.espncricinfo.com/series/big-bash-league-2022-23-1324623";

const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const AllmatchObj = require("./Allmatch");

const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);

request(url, cb);

function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractLink(html);
    }
}

function extractLink(html) {

    let $ = cheerio.load(html);
    let anchorElem = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2 > a");
    let link = anchorElem.attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;

    // console.log(fullLink);
    AllmatchObj.gAllMatches(fullLink);

}

function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }
}

