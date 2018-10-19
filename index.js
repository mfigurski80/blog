const express = require('Express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");

const app = express();
app.set('view engine', 'pug'); // setting pug as template engine
app.set('views','./views'); // showing where templates are
app.use(express.static(__dirname + '/public')); // showing where static files are

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser()); // support cookie parsing
app.use(fileUpload()); // support file uploading


const router = require("./router.js");
app.use("/", router); // push all important stuff (sike, everything) to router

app.listen(3000);
