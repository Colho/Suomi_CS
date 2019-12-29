'use strict';

const express = require('express');
const request = require('request-promise');
const fs = require('fs');
//const { HLTV } = require('hltv')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const baseUrl = "https://api.pandascore.co";
const token = "Pc6B5esWxcCJm0GBe9svCpHiTAmHJ0g6N6BzJlINmIW-jjic8jw";
const teamSize = 50;
var finTeams = [];
/*
EXAMPLE STRUCTURE
[{
  team_name: null,
  team_id: null,
  team_image_url: null,
  players: [
    {
      name: null
    }
  ] 
}]
*/

// App
const app = express();
app.get('/', async (req, res) => {
  await updateTeams();
  res.send("asd");
});

// Async function that can be used to update/create the team data in teams.txt
async function updateTeams() {
  let keepGoing = true;
  let page = 1;
  finTeams = [];
  while (keepGoing) {
    // Get the paginated teams from PandaScore
    let response = await getTeams(page)
    var teams = JSON.parse(response);
    // Go through the teams
    teams.forEach(function(team) {
      // Go through the players in the team
      team.players.forEach(function(player) {
        // If the player is from Finland, save the result
        if (player.hometown == "Finland") {
          // New team to be saved to JSON object
          var index = teamAlreadySaved(team.name);
          if (index == 0) {
            var o = {};
            o.team_name = team.name;
            o.team_id = team.id;
            o.team_image_url = team.image_url;
            o.players = [];
            var p = {};
            p.name = player.name;
            o.players.push(p);
            finTeams.push(o);
          }
          // Team already in the JSON object, add only the player
          else {
            var p = {};
            p.name = player.name;
            finTeams[index].players.push(p);
          }
        }
      });
    });
    page += 1;
    // If the package received is smaller than the default payload size, stop polling the service
    if (Object.keys(response).length < teamSize) {
      keepGoing = false;
    }
  }
  //console.log(JSON.stringify(finTeams));
  // Saving the team data to file for future use
  fs.writeFile("teams.txt", JSON.stringify(finTeams), function(err) {
    if(err) {
      // Error handling?
      return console.log(err);
    }
    //console.log("The file was saved!");
  });
}

// Function to request teams
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

// A function to check if a team is already saved in the struct.
// Returns index if it is, returns 0 if not
function teamAlreadySaved(teamName) {
  var i;
  for (i = 0; i < finTeams.length; i++) {
      if (finTeams[i].team_name === teamName) {
          return i;
      }
  }
  return 0;
}

// Start server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);