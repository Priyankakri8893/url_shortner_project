const express = require("express");
const router = express.Router();
const {createUrl,getUrl} = require('../controllers/urlController')


// creating get and Post api 
router.post("/url/shorten", createUrl );
router.get("/:urlCode", getUrl )

//exporting 
module.exports = router;

