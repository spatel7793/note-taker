const fs = require('fs');
const path = require('path');
const shortId = require('shortid');

module.exports = app => {

    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;

        var notes = JSON.parse(data);

        app.get("/api/notes", function (req, res) {
            res.json(notes);
        });

        app.post("/api/notes", function (req, res) {
            console.log(req);
           let newNote = {
               title: req.body.title,
               text: req.body.text,
               id:shortId.generate()
           };
            notes.push(newNote);
            updateDb();
            console.log("Add new note: " + newNote.title);
            res.json(notes);
        });

        app.delete("/api/notes/:id", function (req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id " + req.params.id);
            res.json(notes);
        });

        app.get('/notes', function (req, res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });

        app.get('*', function (req, res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        function updateDb() {
            fs.writeFile("db/db.json", JSON.stringify(notes, '\t'), err => {
                if (err) throw err;
                return true;
            });
        }
    })
}