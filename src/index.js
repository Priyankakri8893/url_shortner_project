const express = require("express");
const mongoose = require("mongoose");

const app = express();

const route = require("./routes/route")

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, 
    { useNewUrlParser: true})
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.error(err.message);
  });


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', route)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

