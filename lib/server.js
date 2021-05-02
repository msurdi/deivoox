require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const _ = require("lodash");
const datefns = require("date-fns");
const helmet = require("helmet");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const config = require("./config");
const urls = require("./urls");
const cienciaCiertaFeed = require("./channels/cienciacierta");
const gemmaFeed = require("./channels/gemma");

const throttledCienciaCiertaFeed = _.throttle(
  cienciaCiertaFeed,
  datefns.milliseconds({ days: 1 })
);

const throttledGemmaFeed = _.throttle(
  gemmaFeed,
  datefns.milliseconds({ days: 1 })
);

const createServer = async () => {
  const app = express();

  if (config.sentryDSN) {
    Sentry.init({
      dsn: config.sentryDSN,
      tracesSampleRate: 0.1,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({
          app,
        }),
      ],
    });
  }

  app.use(helmet());
  app.use(morgan("combined"));

  app.get(urls.cienciacierta(), async (req, res) => {
    const feed = await throttledCienciaCiertaFeed();
    return res.type("xml").send(feed);
  });

  app.get(urls.gemma(), async (req, res) => {
    const feed = await throttledGemmaFeed();
    return res.type("xml").send(feed);
  });

  // Keept for backward compatibility
  app.get(urls.feed(), async (req, res) => {
    const feed = await throttledCienciaCiertaFeed();
    return res.type("xml").send(feed);
  });

  app.listen(config.port, config.address, () =>
    // eslint-disable-next-line no-console
    console.log(`Server ready at http://${config.address}:${config.port}`)
  );
};

module.exports = createServer;
