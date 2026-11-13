const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Designate the static folder as serving static resources
//app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/static'));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/login.html');
});

app.get("/map", (req, res) => {
  res.sendFile(__dirname + "/templates/map.html");
});

app.get("/events", (req, res) => {
  res.sendFile(__dirname + "/templates/events.html");
});

app.get("/reviews", (req, res) => {
  res.sendFile(__dirname + "/templates/reviews.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/templates/login.html");
});

app.get("/browse", (req, res) => {
  res.sendFile(__dirname + "/templates/browse.html");
}); 

app.get("/favorites", (req, res) => {
  res.sendFile(__dirname + "/templates/favorites.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/templates/register.html");
});

app.get("/businessSubmission", (req, res) => {
  res.sendFile(__dirname + "/templates/businessSubmission.html");
});

app.get("/offline", (req, res) => {
  res.sendFile(__dirname + "/templates/offline.html");
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));