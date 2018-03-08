const axios = require("axios");
require("dotenv").config({ path: "../variables.env" });

const { scrapeSoundtrackData } = require("./ScrapeService");

let spotifyPlayListEndPoint;
let spotifySearchEndPoint;
let spotifyAccessToken;
let spotifyUserID;
let axiosConfig;

const setupEnvironmentVariables = () => {
  spotifyPlayListEndPoint = process.env.SPOTIFY_PLAYLIST_ENDPOINT;
  spotifySearchEndPoint = process.env.SPOTIFY_SEARCH_ENDPOINT;
  spotifyAccessToken = process.env.SPOTIFY_ACCESS_TOKEN;
  spotifyUserID = process.env.SPOTIFY_USERID;

  axiosConfig = {
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`
    }
  };
};
const buildPlaylist = async selectedMovie => {
  setupEnvironmentVariables();
  try {
    const scrapedData = await scrapeSoundtrackData(selectedMovie);
    const spotifyTrackURIs = await getSpotifyTrackURIs(scrapedData);
    const playlistId = await createPlaylistOnSpotify(selectedMovie);
    const response = await addTracksToSpotifyPlaylist(
      spotifyTrackURIs,
      playlistId
    );
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
    },
    headers: axiosConfig.headers
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
    method: "POST",
    headers: axiosConfig.headers
  };
  try {
    await axios(config);
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
    },
    headers: axiosConfig.headers
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
