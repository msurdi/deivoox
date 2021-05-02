module.exports = {
  port: process.env.PORT || 8080,
  address: process.env.ADDRESS || "0.0.0.0",
  sentryDSN: process.env.SENTRY_DSN,
};
