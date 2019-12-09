'use strict';

const express = require('express');
const { HLTV } = require('hltv')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  HLTV.getMatches().then((res2) => {
    res.send(res2);
  })
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);