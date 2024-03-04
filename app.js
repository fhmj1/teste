const express = require("express");
const PlaylistController = require("./src/controller/playlistController");
const app = express();

const playlist = new PlaylistController();
playlist.get_id_url();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running in port: ${PORT}`);
});
