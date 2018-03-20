const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const axios = require("axios");
const helmet = require("helmet");

require("dotenv").config({ path: "variables.env" });

const { buildPlaylist } = require("./services/SoundTrackService");
const { checkSpotifyToken } = require("./services/Auth");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(helmet());
  server.use(bodyParser.json());
  server.use(function(error, req, res, next) {
    console.log("begin stack");
    console.error(error.stack);
    console.log("end stack");
    res.send(error);
  });
  server.get("/", (req, res) => {
    const indexPage = "/";
    app.render(req, res, indexPage);
  });
  server.get("/about", (req, res) => {
    const aboutPage = "/about";
    app.render(req, res, aboutPage);
  });
  server.post("/search", [
    checkSpotifyToken,
    async (req, res) => {
      const { selectedMovie } = req.body;
      try {
        const playlistId = await buildPlaylist(selectedMovie);
        res.json({ success: true, playlistId });
      } catch (error) {
        console.log(error);
        res.json({ success: false });
      }
    }
  ]);
  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(3001, err => {
    if (err) throw err;
  });
});
