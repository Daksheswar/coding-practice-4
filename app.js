const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
let db = null;
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(1000, () => {
      console.log("server is running at http://localhost:1000/");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getQuery = `
    SELECT * FROM  cricket_team;`;
  const booksArray = await db.all(getQuery);
  let myArr = [];
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };
  for (let each of booksArray) {
    let a = convertDbObjectToResponseObject(each);
    myArr.push(a);
  }
  response.send(myArr);
});

//Post
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayer = `
    INSERT INTO cricket_team
    (player_name,jersey_number,role)
    VALUES
    ("${playerName}",${jerseyNumber},
    "${role}");`;
  const dpResponse = await db.run(addPlayer);
  const playerId = dpResponse.lastID;
  response.send("Player Added to Team");
});
module.exports = app;
