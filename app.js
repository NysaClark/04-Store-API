const express = require("express");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();
require('express-async-errors');
const productsRouter = require('./routes/products');
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app
      .use([express.urlencoded({extended: false}), express.json()])
      .get("/", (req, res) => res.send("home"))
      .use('/api/v1/products', productsRouter)
      .use(notFound)
      .use(errorHandler)
      .listen(3000, () => console.log("listening @ 3000"));
  } catch (err) {
    console.log(err);
  }
};

startServer();
