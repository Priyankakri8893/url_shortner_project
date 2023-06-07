const mongoose = require("mongoose"); // importing mongoose


// creating urlShema 
const urlSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  longUrl: {
    type: String,
    required: true,
    trim: true,

  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

// exporting 
module.exports = mongoose.model("Url", urlSchema)


// { urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }
