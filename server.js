const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const PORT = 3001;
const fs = require("fs");

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

// return notes.html file
app.get("/notes", (req, res) => {
    console.info(`${req.method} request received to get notes`);

    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// return all db info
app.get('/api/notes', (req, res) => {
    // Log our request to the terminal
    console.info(`${req.method} request received to get all notes`);

    // Sending all reviews to the client
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        res.json(JSON.parse(data));
    });
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
    // Prepare a response object to send back to the client
    let response;
    // Check if there is anything in the request body
    if (req.body.title && req.body.text) {

        const idNum = Math.trunc(Math.random() * (9999 - 1) + 1);

        fs.readFile("./db/db.json", "utf8", function (err, data) {
            const dataArr = JSON.parse(data);
            req.body.id = idNum;
            dataArr.push(req.body);
            const newData = JSON.stringify(dataArr);
            fs.writeFile(`./db/db.json`, newData, (err) =>
                err
                    ? console.error(err)
                    : console.log(
                        `New note has been written to JSON file`
                    )
            );
        });

        response = {
            status: 'success',
            data: req.body,
        };
        res.json(response);
    } else {
        res.json('Note must contain a title and text.');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to delete a note`);

    const requestedId = parseInt(req.params.id);
    if (requestedId) {
        fs.readFile("./db/db.json", "utf8", function (err, data) {
            const dataArr = JSON.parse(data);
            for (const obj in dataArr) {
                if (requestedId === dataArr[obj].id) {
                    console.log(obj);
                    console.log(dataArr);
                    dataArr.splice(obj, 1);
                    console.log(dataArr);
                    const newData = JSON.stringify(dataArr);
                    fs.writeFile(`./db/db.json`, newData, (err) =>
                        err
                            ? console.error(err)
                            : res.json(`deleted note with ${requestedId}`)
                    );
                }
            }
        });
    } else {
        res.status(500).json(`could not find ${requestedId}`)
    }
});
// return the index.html file
app.get("*", (req, res) => {
    console.info(`${req.method} request received to get index`);

    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}!`)
);
