'use strict';

const express = require('express');
const request = require('request-promise');
const fs = require('fs');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const baseUrl = "https://api.pandascore.co";
const token = "Pc6B5esWxcCJm0GBe9svCpHiTAmHJ0g6N6BzJlINmIW-jjic8jw";
const payloadSize = 50;
var finTeams = [];
var finMatches = [];
/* Maybe initialize these?
EXAMPLE STRUCTURES
finTeams = 
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
finMatches = 
[{
  type: null (past, ongoing, upcoming),
  start_time: null,
  opponents: [
    {
      name: null,
      team_image_url: null,
      finPlayers: [
        {
          name: null
        }
      ]
    }
  ]
  score_maps: null,
  score_rounds: null,
  league: null,
  league_image_url: null
}]
*/

// Index
const app = express();
app.get('/', async (req, res) => {
  //await updateTeams();
  await updateMatches();
  res.send(finMatches);
});
// Possible future routes for data fetching
/*
app.get('/getTeams', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/getMatches', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/getPastMatches', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/getOngoingMatches', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/getUpcomingMatches', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/updateTeams', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/updateMatches', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/updatePastMatches', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/updateOngoingMatches', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});

app.get('/updateUpcomingMatches', async (req, res) => {
  //await updateTeams();
  //await updateMatches();
  res.send("asd");
});
*/
// Function that is used to create/update the matches data in past.txt, ongoing.txt and upcoming.txt
async function updateMatches() {
  // This needs checking, does this work correctly?
  fs.readFile('teams.txt', (err, data) => {
    if (err) throw err;
    finTeams = JSON.parse(data);
  });
  // Past matches not yet done, because it needs some kind of time filter
  //await paginateMatches('past');
  await paginateMatches('running');
  await paginateMatches('upcoming');
}

// A function to go through different types of matches. This needs some review
// Is it really necessary to go through different kinds of matches separately.
async function paginateMatches(type) {
  let keepGoing = true;
  let page = 1;
  finMatches = [];
  // Check is finTeams data correct?
  
  while (keepGoing) {
    // Get the paginated matches from PandaScore
    //console.log(type);
    let response = await getMatches(page, type)
    var matches = JSON.parse(response);
    // Go through the matches
    matches.forEach(function(match) {
      // If no opponents, skip this match
      if (match.opponents.length < 2) return;
      //console.log(match.name);
      //console.log(match.opponents[0].opponent.name);
      //console.log(match.opponents[1].opponent.name);
      // Go through the finnish teams
      finTeams.forEach(function(team) {
        // This should be more modular
        if (match.opponents[0].opponent.name == team.team_name || match.opponents[1].opponent.name == team.team_name) {
          //console.log(team.name);
          var m = {};
          m.type = type;
          m.start_time = match.begin_at;
          m.opponents = [];
          var o1 = {};
          var o2 = {};
          o1.name = match.opponents[0].opponent.name;
          o2.name = match.opponents[1].opponent.name;
          o1.team_image_url = match.opponents[0].opponent.image_url;
          o2.team_image_url = match.opponents[1].opponent.image_url;
          // Add the finPlayers?
          o1.finPlayers = [];
          o2.finPlayers = [];
          m.score_maps = null;
          m.score_rounds = null;
          m.league = null;
          m.league_image_url = null;
          m.opponents.push(o1, o2);
          finMatches.push(m);
        }
      });
    });
    page += 1;
    // If the package received is smaller than the default payload size, stop polling the service
    if (Object.keys(response).length < payloadSize) {
      keepGoing = false;
    }
  }
  //console.log(JSON.stringify(finTeams));
  // Saving the team data to file for future use
  fs.writeFile(type + ".txt", JSON.stringify(finMatches), function(err) {
    if(err) {
      // Error handling?
      return console.log(err);
    }
    //console.log("The file was saved!");
  });
}

// Function to request matches
// Needs 3 different cases, past, ongoing and upcoming
// Past not yet done, because of the required time filter
const getMatches = async (page, type) => {
  const teamReq = {
      uri: `${baseUrl}/csgo/matches/${type}?begin_at=name&page=${page}`,
      headers : {
        "Authorization" : "Bearer " + token
      }
  };
  let payload = await request(teamReq);
  return payload;
}

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
    if (Object.keys(response).length < payloadSize) {
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