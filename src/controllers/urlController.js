const urlModel = require("../models/urlModel");
const validURL = require("valid-url");
const { customAlphabet } = require("nanoid");
// const { SETEX_ASYNC, GET_ASYNC } = require("../aws/redis.js");


// creatig url handler part
const createUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).send({
        status: false,
        message: "Missing LongUrl",
      });
    }
    if (!validURL.isWebUri(longUrl)) {
      return res.status(400).send({
        status: false,
        message: "Invalid URL",
      });
    }

    // // check if longUrl is already cached in redis server
    // let cachedUrl = await GET_ASYNC(longUrl);

    // if (cachedUrl) {
    //   // if present then send it to user
    //   let result = JSON.parse(cachedUrl)
    //   console.log(result)
    //   return res.status(201).send({
    //     status: true,
    //     data: {
    //       urlCode: result.urlCode,
    //       longUrl: result.longUrl,
    //       shortUrl: result.shortUrl
    //     }
    //   })
    // }

    // finding in db
    let url = await urlModel.findOne({
      longUrl: longUrl
    });
    if (url) {

      // // adding in redis
      // await SETEX_ASYNC(
      //   longUrl,
      //   24 * 60 * 60,
      //   JSON.stringify({
      //     urlCode: url.urlCode,
      //     shortUrl: url.shortUrl,
      //     longUrl: longUrl
      //   })
      // );
      return res.status(200).send({
        status: true,
        data: url
      });
    }

    // using nanoId for generating urlcode
    const alphabet =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const shortId = customAlphabet(alphabet, 10);
    const urlCode = shortId();

    const shortUrl = `http://localhost:3000/${urlCode}`;

    req.body.urlCode= urlCode
    req.body.shortUrl= shortUrl

    // creating entries in db
    const data = await urlModel.create(req.body);

    // // adding longUrl in redis
    // await SETEX_ASYNC(
    //   longUrl,
    //   24 * 60 * 60,
    //   JSON.stringify({
    //     urlCode,
    //     shortUrl,
    //     longUrl
    //   })
    // );

    return res.status(201).send({
      status: true,
      data: data
    });
  }
  catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }

}

// ******************************************************************************* //

//getUrl handler part
const getUrl = async (req, res) => {
  try {
    const { urlCode } = req.params;


    // // fetching from redis
    // let cachedUrl = await GET_ASYNC(urlCode);
    // if (cachedUrl) {
    //   return res.status(302).redirect(JSON.parse(cachedUrl).longUrl);
    // }

    // if not present in redis then searching in db
    const url = await urlModel.findOne({ urlCode: urlCode});

    if (!url) {
      return res.status(404).json({
        status: false,
        message: "URL not found",
      });
    }

    // // adding in redis 
    // await SETEX_ASYNC(
    //   urlCode,
    //   24 * 60 * 60,
    //   JSON.stringify(url)
    // );

    return res.status(302).redirect(url.longUrl);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// exporting createUrl and getUrl
module.exports = {
  createUrl,
  getUrl,
};
