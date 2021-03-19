require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const _ = require("lodash");
const datefns = require("date-fns");
const helmet = require("helmet");
const config = require("./config");
const urls = require("./urls");
const createFeed = require("./feed");

const createServer = async () => {
  const app = express();
  app.use(helmet());
  app.use(morgan("combined"));

  const debouncedCreateFeed = _.throttle(
    createFeed,
    datefns.milliseconds({ days: 1 })
  );

  app.get(urls.feed(), async (req, res) => {
    const feedBody = await debouncedCreateFeed();
    res.contentType = "text/xml; charset=utf-8";
    return res.send(feedBody);
  });

  app.listen(config.port, config.address, () =>
    // eslint-disable-next-line no-console
    console.log(`Server ready at http://${config.address}:${config.port}`)
  );
};

module.exports = createServer;
