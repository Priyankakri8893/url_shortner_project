const redis = require('redis');

// Load environment variables from .env file
require("dotenv").config();

const { promisify } = require('util');

// Connect to the Redis server using the environment variables
const Client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  no_ready_check: true
});

// Authentication callback
Client.auth(process.env.REDIS_PASSWORD, function (err) {
  if (err) throw err;
});

// Event listener for successful connection
Client.on('connect', async function () {
  console.log('Connected to Redis...');
});

// Promisify Redis commands
const SETEX_ASYNC = promisify(Client.SETEX).bind(Client);
const GET_ASYNC = promisify(Client.GET).bind(Client);

module.exports= {SETEX_ASYNC, GET_ASYNC}
