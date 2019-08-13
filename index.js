const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(express.static(path.join(__dirname + "/public")));
const router = express.Router();
const port = 5500;

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/index.html"));
});

router.get("/model_list", (req, res) => {
    let data = {
        models: []
    };
    const directoryPath = path.join(__dirname, "/public/models");

    fs.readdir(directoryPath, (err, files) => {
        //handling error
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }
        //listing all files using forEach
        files.forEach(file => {
            // Do whatever you want to do with the file
            const name = file.split(".")[0];
            const newModel = {
                name,
                path: "models/" + file
            };
            data.models.push(newModel);
        });
        console.log(data);
        res.set("Content-Type", "Application/JSON");

        res.send(data);
    });
});

//add the router
app.use("/", router);

app.listen(
    process.env.port || port,
    console.log(`Model viewer running on http://localhost:${port}/`)
);