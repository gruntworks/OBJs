const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname + '/public')));
const router = express.Router();
const port = 5500;

router.get('/', (req, res)=>{res.sendFile(path.join(__dirname + '/views/index.html'))});
//add the router
app.use('/', router);
app.listen(process.env.port || port, console.log(`Model viewer running on port ${port}!`));