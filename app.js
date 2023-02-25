// jshint:version 8

// Requires
const express = require('express');
const app = express();
const _ = require('lodash');
const fs = require("fs");
const ejs = require("ejs")
const port = process.env.PORT || 3000;

// Express Configuration
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(
    express.urlencoded({
        extended: true,
    })
);

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// Read the raw file and parse it as a JSON
const colleges = JSON.parse(fs.readFileSync('./data/college-list.json'));

// Data storage for states and district
const statesAndDistricts = JSON.parse(fs.readFileSync('./data/states-districts.json'))

// Get colleges for given state and district
function list_college(state, district) {
    const result = []
    colleges.forEach((object, index) => {
        if (object['State Name'] == state && object['District Name'] == district) {
            result.push(colleges[index])
        }
    });
    return result
}


app.get("/", (req, res) => {
    res.render("index", { data: JSON.stringify(statesAndDistricts) })
    // res.send("This is an api for colleges in India.")
});

app.post("/api/college/", (req, res) => {
    const { state, district } = req.body
    res.redirect("/api/college/" + state + "/" + district)
});

app.get("/api/college/:state/:district", (req, res) => {
    const state = _.unescape(req.params.state);
    const district = _.unescape(req.params.district);
    const result = list_college(state, district);
    res.render("list-college", { data: JSON.stringify(result) });
});

// test code
// list_college("Maharashtra", "Mumbai")

app.listen(port, () => console.log(`Listening on port http://localhost:${port}`));