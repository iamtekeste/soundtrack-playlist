const scrapeIt = require("scrape-it");
const axios = require("axios");
require("dotenv").config({ path: "variables.env" });

const spotifyPlayListEndPoint = process.env.SPOTIFY_PLAYLIST_ENDPOINT;
const spotifySearchEndPoint = process.env.SPOTIFY_SEARCH_ENDPOINT;
const spotifyAddTrackToPlayListEndPoint = spotifyPlayListEndPoint;
const spotifyAccessToken = process.env.SPOTIFY_ACCESS_TOKEN;
const spotifyUserID = process.env.SPOTIFY_USERID;
const axiosConfig = {
  headers: {
    Authorization: `Bearer ${spotifyAccessToken}`
  }
};
const createSoundTracksPageURL = (movie, appendYear = true) => {
  let year = movie.release_date.split("-")[0];
  let formattedTitle = movie.title.replace(" ", "-");
  formattedTitle = appendYear ? `${formattedTitle}-${year}` : formattedTitle;
  return `https://www.tunefind.com/movie/${formattedTitle}`;
};
const getSoundTracks = soundtrackURL => {
  return scrapeIt(soundtrackURL, {
    soundtracks: {
      listItem: "div[class^=SongRow__container]",
      data: {
        title: {
          selector: "a[title]",
          attr: "title"
        },
        artist: ".Tunefind__Artist"
      }
    }
  })
    .then(({ data, response }) => {
      if (response.statusCode === 200) return data;
      throw new Error("404");
    })
    .catch(err => {
      throw err;
    });
};

const getSpotifyURIs = ({ soundtracks }) => {
  return soundtracks.map(soundtrack => {
    const config = {
      url: spotifySearchEndPoint,
      params: {
        q: `track:${soundtrack.title} artist:${soundtrack.artist}`,
        type: "track",
        limit: 1
      },
      headers: axiosConfig.headers
    };
    return axios(config)
      .then(response => {
        const track = response.data.tracks.items[0];
        if (track) {
          return track.uri;
        }
      })
      .catch(error => {
        throw error;
      });
  });
};
const createPlaylist = function(soundTracks, selectedMovie, cb) {
  let playlistID = null;
  const bodyParams = {
    name: `${selectedMovie.title} Soundtrack`,
    description: `All the music from ${selectedMovie.title}`,
    public: true
  };
  return axios
    .post(spotifyPlayListEndPoint, bodyParams, axiosConfig)
    .then(response => {
      // create playlist
      return response.data;
    })
    .then(({ id }) => {
      playlistID = id;
      // collect track uris
      return Promise.all(getSpotifyURIs(soundTracks));
    })
    .then(trackURIs => {
      //TODO: see if we can get rid of this filtering here
      const filteredTrackURIs = trackURIs.filter(trackURI => {
        return trackURI !== undefined;
      });
      const config = {
        url: spotifyPlayListEndPoint + "/" + playlistID + "/tracks",
        params: { uris: filteredTrackURIs.join(",") },
        method: "POST",
        headers: axiosConfig.headers
      };
      return axios(config)
        .then(response => {
          return playlistID;
        })
        .catch(error => {
          console.log(error.message);
        });
    })
    .catch(error => {
      console.log(error.message, "fail");
    });
};
module.exports = {
  getSoundTracks,
  createSoundTracksPageURL,
  createPlaylist
};
