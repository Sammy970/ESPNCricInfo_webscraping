const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const xlsx = require("xlsx");

//homepage
function processScorecard(url) {

    request(url, cb);
}

// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";


function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractMatchDetails(html);
    }
}

//venue date opponent result runs balls fours sixes sr(strikerate)
function extractMatchDetails(html) {

    let $ = cheerio.load(html);
    let descElem = $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let result = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title");
    let stringArr = $(descElem.text().split(","));
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim() + "," + " " + stringArr[3].trim();
    result = result.text().trim();
    // console.log(venue);
    // console.log(date);
    // console.log(result);
    // let innings = $(".ds-rounded-lg.ds-mt-2 > .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4");

    let innings = $(".ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4");
    let teamArr = $(".ds-text-tight-l.ds-font-bold.ds-text-ui-typo.hover\\:ds-text-ui-typo-primary.ds-block.ds-truncate");

    // let htmlStr = "";
    for (let i = 0; i < 2; i++) {
        // htmlStr += $(innings[i]).html();
        // console.log(htmlStr);

        //team opponent
        let teamName = $(teamArr[0]).text();
        let opponentName = $(teamArr[1]).text();

        // //player names
        let cInning = $(innings[i]);
        console.log(`${venue} | ${date} | ${teamName} | ${opponentName} | ${result}`);
        let allRows = cInning.find(".ds-w-full.ds-table.ds-table-md.ds-table-auto tbody tr");
        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("ds-w-0 ds-whitespace-nowrap ds-min-w-max");

            if (isWorthy == true) {
                // console.log(allCols.text());
                //player name runs balls fours sixes sr opponent
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();

                console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${sr} `);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result);
            }
        }
    }

}

// function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result) {
//     teampath = path.join(__dirname, "ipl", teamName);
//     dirCreator(teampath);
//     let updatePlayerName = playerName + ".xlsx";
//     // console.log(updatePlayerName);
//     playerPath = path.join(teampath, updatePlayerName);
//     // console.log(playerPath);
//     let data = excelReader(playerPath, playerName);
//     let content = [{playerName, runs, balls, fours, sixes, sixes, sr, opponentName, venue, date, result}]

//     // console.log(content);

//     let newWb = xlsx.utils.book_new();
//     let newWs = xlsx.utils.json_to_sheet(content);
//     xlsx.utils.book_append_sheet(newWb, newWs, playerName);
//     xlsx.writeFile(newWb, playerPath);


// }


function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result) {
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreator(teamPath);

    let updatePlayerName = playerName + ".xlsx";
    let filePath = path.join(teamPath, updatePlayerName);
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}
















function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filepath, json, sheetName) {
    let newWb = xlsx.utils.book_new();
    let newWs = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWb, newWs, sheetName);
    xlsx.writeFile(newWb, filepath);
}

function excelReader(filepath, sheetName) {
    if (fs.existsSync(filepath) == false) {
        return [];
    }

    let wb = xlsx.readFile(filepath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    // console.log("Hello Else is working");
    return ans;

}

module.exports = {
    ps: processScorecard
}