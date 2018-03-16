const { call } = require("../libs/dynamodb");
const savePlaylistToDB = async (playlistId, movie) => {
  const params = {
    TableName: "playlist",
    Item: {
      movieId: movie.id,
      playlistId: playlistId,
      movie: JSON.stringify(movie),
      createdAt: new Date().getTime()
    }
  };
  try {
    const response = await call("put", params);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getPlaylistFromDB = async movie => {
  const params = {
    TableName: "playlist",
    Key: {
      movieId: movie.id
    }
  };
  try {
    const result = await call("get", params);
    if (result.Item) {
      return result.Item.playlistId;
    } else {
      throw new Error("Item not found");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  savePlaylistToDB,
  getPlaylistFromDB
};
