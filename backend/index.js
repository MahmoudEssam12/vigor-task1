require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const userRoute = require("./Router/userRouter")



mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("connected to DB")
        app.listen(process.env.PORT || 8080, () => {
            console.log("Listening...")
        })
    }).catch(err => {
        console.log("Error", err);
        console.log("DB Problem")
    });

app.use(morgan(":method :url"));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


//Routing
app.use(userRoute);

// Error MWs
app.use((req, res) => {
    res.status(404).json({ data: "404 NOT FOUND" })
});

app.use((err, req, res, next) => {
    let status = err.status || 500;
    res.status(status).json({ error: err + "" })
})