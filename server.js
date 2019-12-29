'use strict';

const express = require('express');
const request = require('request-promise');
//const { HLTV } = require('hltv')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const baseUrl = "https://api.pandascore.co";
const token = "Pc6B5esWxcCJm0GBe9svCpHiTAmHJ0g6N6BzJlINmIW-jjic8jw";
const teamSize = 50;
var finTeams = {};

// App
const app = express();
app.get('/', async (req, res) => {
  let keepGoing = true;
  let page = 1;
  while (keepGoing) {
    let response = await getTeams(page)
    var teams = JSON.parse(response);
    teams.forEach(function(team) {
      //console.log(team.name);
      team.players.forEach(function(player) {
        //console.log(player.last_name);
        if (player.hometown == "Finland") {
          if (!finTeams.hasOwnProperty(team.name)) {
            // Add team key here with info
          }
          else {
            // Add relevant info under team key here
          }
          console.log(team.name + ":  " + player.name);
        }
      });
    });
    page += 1;
    if (Object.keys(response).length < teamSize) {
      keepGoing = false;
      //return records;
    }
  }
  res.send("asd");
});

const getTeams = async (page) => {
  const teamReq = {
      uri: `${baseUrl}/csgo/teams?sort=name&page=${page}`,
      headers : {
        "Authorization" : "Bearer " + token
      }
  };
  let payload = await request(teamReq);
  return payload;
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);