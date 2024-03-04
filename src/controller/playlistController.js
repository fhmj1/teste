const ytpl = require("ytpl");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

class PlaylistController {
  constructor() {
    this.playlistId = "PLYMoJivdJaVlxVjYKUV-MzR2Klkk5Bujt";

    //linux
    this.folder_path = path.join(__dirname, "../downloads");
    this.path_executable_vlc = path.join(
      __dirname,
      "../../../../../../../../snap/bin/vlc"
    );

    // //raspberry
    // this.folder_path = path.join(__dirname, "../downloads");
    // this.path_executable_vlc = "vlc"
  }

  async get_id_url() {
    try {
      const playlist = await ytpl(this.playlistId);
      const videosIds = playlist.items.map((video) => video.id);

      if (!fs.existsSync(this.folder_path)) {
        fs.mkdirSync(this.folder_path);
      }

      for (const videoId of videosIds) {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const fileName = `${videoId}.mp4`;
        const downloadPath = path.join(this.folder_path, fileName);

        if (!fs.existsSync(downloadPath)) {
          await this.downloadVideo(videoUrl, downloadPath);
        }
      }
      this.exec_midia();
    } catch (e) {
      console.log(e);
      throw new Error("Erro ao buscar id dos videos da playlist");
    }
  }

  async downloadVideo(videoUrl, downloadPath) {
    return new Promise((resolve, reject) => {
      try {
        const videoStream = ytdl(videoUrl, {
          ChooseFormatQuality: "highestaudio",
          filter: "audioandvideo",
        });

        videoStream
          .pipe(fs.createWriteStream(downloadPath))
          .on("finish", () => {
            resolve();
          })
          .on("error", (error) => {
            reject(error);
          });
      } catch (e) {
        throw new Error("Erro ao baixar a playlist");
      }
    });
  }

  exec_midia() {
    return new Promise((resolve, reject) => {
      exec(`${this.path_executable_vlc} --loop ${this.folder_path}`, (error, stdout, stderr) => {
        if (error) {
          console.log(error)
          throw new Error("Erro ao abrir o VLC");
        } else if (stderr) {
          throw new Error("Erro ao abrir o VLC");
        }
      });
    });
  }
}

module.exports = PlaylistController;