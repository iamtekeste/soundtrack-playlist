const axios = require("axios");
const { scrapeSoundtrackData } = require("./ScrapeService");
const { getPlaylistFromDB, savePlaylistToDB } = require("./DBService");
const {
  spotifyPlayListEndPoint,
  spotifySearchEndPoint,
  spotifyUserID,
  tunefindURL
} = require("../config");

let spotifyAccessToken;
const setupEnvVars = () => {
  spotifyAccessToken = process.env.SPOTIFY_ACCESS_TOKEN;
  axios.defaults.headers.Authorization = `Bearer ${spotifyAccessToken}`;
};
const buildPlaylist = async selectedMovie => {
  setupEnvVars();
  try {
    let playlistId = await getPlaylistFromDB(selectedMovie);
    if (playlistId) {
      return playlistId;
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const scrapedData = await scrapeSoundtrackData(selectedMovie);
    const spotifyTrackURIs = await getSpotifyTrackURIs(scrapedData);
    playlistId = await createPlaylistOnSpotify(selectedMovie);
    playlistId = await addTracksToSpotifyPlaylist(spotifyTrackURIs, playlistId);
    setTimeout(() => {
      savePlaylistToDB(playlistId, selectedMovie);
    }, 0);
    return playlistId;
  } catch (error) {
    console.log(error);
  }
};

const getSpotifyTrackURIs = async ({ soundtrackData }) => {
  try {
    const trackURIs = await Promise.all(
      soundtrackData.map(trackData => getTrackInfoFromSpotify(trackData))
    );
    const filteredTrackURIs = trackURIs.filter(trackURI => {
      return trackURI !== undefined;
    });
    return filteredTrackURIs;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const createPlaylistOnSpotify = async selectedMovie => {
  const config = {
    url: spotifyPlayListEndPoint,
    method: "POST",
    data: {
      name: `${selectedMovie.title} Soundtrack`,
      description: `All the music from ${selectedMovie.title}`,
      public: true
    }
  };
  try {
    const response = await axios(config);
    return response.data.id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addTracksToSpotifyPlaylist = async (spotifyTrackURIs, playlistId) => {
  const config = {
    url: spotifyPlayListEndPoint + "/" + playlistId + "/tracks",
    params: { uris: spotifyTrackURIs.join(",") },
    method: "POST"
  };
  try {
    await axios(config);
    return playlistId;
  } catch (error) {
    throw error;
  }
};
const getTrackInfoFromSpotify = async trackData => {
  const config = {
    url: spotifySearchEndPoint,
    method: "GET",
    params: {
      q: `track:${trackData.title} artist:${trackData.artist}`,
      type: "track",
      limit: 1
    }
  };
  try {
    const response = await axios(config);
    const track = response.data.tracks.items[0];
    if (track) {
      return track.uri;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  buildPlaylist
};
