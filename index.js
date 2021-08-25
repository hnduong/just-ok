#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const ngrok = require('ngrok');

const app = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const port = process.env.PORT || 80;
const enableNgrok = !Boolean(process.env.DISABLE_NGROK);
const enableServer = !Boolean(process.env.DISABLE_SERVER);

app.use(jsonParser, urlencodedParser);

app.all('*', function (req, res) {
  res.status(200).end();
});

const bootstrap = async () => {
  if (enableServer) {
    // setup server
    app.listen(port);
    console.log(`http://localhost:${port}`);
  }

  if (enableNgrok) {
    // setup ngrok
    const url = await ngrok.connect({
      addr: port,
    });
    console.log(`Forwarding: ${url} -> http://localhost:${port}`);
    console.log(`Inspector: http://localhost:4040`);
  }
};

bootstrap();
