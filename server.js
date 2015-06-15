var http = require('http');
var path = require('path');
var card = require("cards");
var users = require("core");
var socketio = require('socket.io');
var express = require('express');
var mysql = require('mysql');
var prefabs = require("prefabs")
var logger = require("logger")
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'secret'
});

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
io.set('log level', 2);
router.use(express.static(path.resolve(__dirname, 'client')));
var sockets = [];
var sessions = [];
var suggestedCards = [];

function findFreeSession() {
  for(var i = 0; i < sessions.length; i++)
    if (sessions[i].isFree()) return sessions[i];
  sessions.push(new users.Session());
  return sessions[sessions.length-1];
}

function findSessionWithPlayer(id) {
  for(var i = 0; i < sessions.length; i++)
    if (sessions[i].havePlayer(id)) return sessions[i];
  return undefined;
}

io.on('connection', function (socket) {
  
    sockets.push(socket);
    var player = findFreeSession().addPlayer(new users.Player(socket));
    
    socket.emit("update-player-state", player.getState());

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      var session = findSessionWithPlayer(player.id);
      if (session != undefined)
      {
        session.close(player);
        logger.log("session #"+session.id+" closed");
        sessions.splice(sessions.indexOf(session), 1);
      }
    });
    
    socket.on("card-drop", function(data){
      if (player.dropCard(data)){
        var session = findSessionWithPlayer(player.id);
        if (session != undefined)
        {
          
          session.dropCard(player.findCard(data), player.id);
        }  
      }
    });
    
    socket.on("attack", function(data) {
      var session = findSessionWithPlayer(data.playerId);
      if (session != undefined)
      {
        var attacked = session.findPlayerWithCard(data.attackedId);
        var attacker = session.findPlayerWithCard(data.attackerId);
        if (attacked == undefined || attacker == undefined || !player.isTurning)
          return;
        session.beatCard(attacked.findCard(data.attackedId), attacker.findCard(data.attackerId), attacked, attacker);
      }
    });
    
    socket.on("end-turn", function(data) {
      if (player.isTurning)
      {
        var session = findSessionWithPlayer(data);
        if (session != undefined)
        {
          session.endTurn();
          socket.emit("end-turn-success");
        }
      }
    });
    
    socket.on("suggest-card", function(data) {
      var newCard = card.CardFactory.fromModel(data);
      card.CardFactory.Cards.push(newCard);
    });
  });

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
