#!/usr/bin/env node
const server = require("../lib/server");

server().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
