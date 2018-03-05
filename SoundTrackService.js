const scrapeIt = require("scrape-it");

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
      return null;
    })
    .catch(err => {
      throw err;
    });
};

exports.getSoundTracks = getSoundTracks;
exports.createSoundTracksPageURL = createSoundTracksPageURL;
