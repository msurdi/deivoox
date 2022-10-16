require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const { StatusCodes } = require("http-status-codes");
const { memoize } = require("lodash");
const { milliseconds } = require("date-fns");
const config = require("./config");
const urls = require("./urls");
const createIvooxFeed = require("./channels/ivoox");

const memoizedIvoox = memoize(createIvooxFeed);

setInterval(() => {
  memoizedIvoox.cache.clear();
}, milliseconds({ hours: 1 }));

const ivooxSchema = yup.object().shape({
  channel: yup.string().url().required(),
});

const createServer = async () => {
  const app = express();
  app.use(helmet());
  app.use(morgan("combined"));

  app.get(urls.status(), (req, res) => res.send("ok"));

  app.get(urls.ivoox(), async (req, res) => {
    const { channel } = await ivooxSchema.validate(req.query);
    const feed = await memoizedIvoox(channel);
    return res.type("xml").send(feed);
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, _next) => {
    if (err instanceof yup.ValidationError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: err.message,
      });
    }
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  });

  app.listen(config.port, config.address, () =>
    // eslint-disable-next-line no-console
    console.log(`Server ready at http://${config.address}:${config.port}`)
  );
};

module.exports = createServer;
