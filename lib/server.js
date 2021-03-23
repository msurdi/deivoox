require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const _ = require("lodash");
const datefns = require("date-fns");
const helmet = require("helmet");
const config = require("./config");
const urls = require("./urls");
const cienciaCiertaFeed = require("./channels/cienciacierta");

const createServer = async () => {
  const app = express();
  app.use(helmet());
  app.use(morgan("combined"));

  const throttledCienciaCiertaFeed = _.throttle(
    cienciaCiertaFeed,
    datefns.milliseconds({ days: 1 })
  );

  app.get(urls.cienciacierta(), async (req, res) => {
    const feed = await throttledCienciaCiertaFeed();
    return res.type("xml").send(feed);
  });

  app.listen(config.port, config.address, () =>
    // eslint-disable-next-line no-console
    console.log(`Server ready at http://${config.address}:${config.port}`)
  );
};

module.exports = createServer;
