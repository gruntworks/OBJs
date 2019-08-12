const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.static(path.join(__dirname + '/public')));
const router = express.Router();
const port = 5500;

router.get('/', (req, res)=>{res.sendFile(path.join(__dirname + '/views/index.html'))});
//add the router
app.use('/', router);
app.listen(process.env.port || port, console.log(`Model viewer running on port ${port}!`));
let model = [];
const directoryPath = path.join(__dirname, "/public/models");
fs.readdir(directoryPath, function (err, files){
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
    model.push(file  + " : " + "models/" + file);
        // Do whatever you want to do with the file 
    });
    console.log(model);

});

exports.model = model;