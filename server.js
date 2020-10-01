const express = require('express');
const morgan = require("morgan")

const PORT = process.env.PORT || 3000;

const server = express()
  .use(morgan("tiny"))           // Minimal logging of web requests.
  .use(express.static("test"))
  .use(express.static("."))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
