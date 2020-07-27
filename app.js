const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const router = require('./routes/user.route');

require('dotenv').config();
require('./models/db');
const port = process.env.PORT;
const app = express();

var corsOptions = {
    origin: "http://localhost:4000"
};
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
