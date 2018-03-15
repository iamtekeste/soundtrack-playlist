const axios = require("axios");
const querystring = require("querystring");
const {
  spotifyRefreshToken,
  spotifyAuthCode,
  spotifyRefreshTokenURL
} = require("../config");
let tokenIssuedTime = 1520785458871;
const checkSpotifyToken = async (req, res, next) => {
  const tokenExpiresIn = tokenIssuedTime + 3540000;
  const now = Date.now();
  if (tokenExpiresIn < now) {
    try {
      //refresh token;
      const spotifyAccessToken = await refreshToken();
      //set it on process.env
      process.env.SPOTIFY_ACCESS_TOKEN = spotifyAccessToken;
      //update tokenIssuedDate;
      tokenIssuedTime = Date.now();
      next();
    } catch (error) {
      console.log(error);
      next();
      throw error;
    }
  }
  next();
};

const refreshToken = async () => {
  const data = querystring.stringify({
    grant_type: "refresh_token",
    refresh_token: spotifyRefreshToken
  });
  const config = {
    headers: {
      Authorization: `Basic ${spotifyAuthCode}`
    }
  };
  try {
    const response = await axios.post(spotifyRefreshTokenURL, data, config);
    if (response.data && response.data.access_token) {
      return response.data.access_token;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { checkSpotifyToken };
