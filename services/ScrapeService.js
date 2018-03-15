const scrapeIt = require("scrape-it");
require("dotenv").config({ path: "../variables.env" });

const tunefindURL = process.env.TUNEFIND_URL;
const scrapingConfig = {
  soundtrackData: {
    listItem: "div[class^=SongRow__container]",
    data: {
      title: {
        selector: "a[title]",
        attr: "title"
      },
      artist: "div[class^=SongEventRow__subtitle] a[class^=Subtitle__subtitle]"
    }
  }
};
/**
 * scrapes tunefind for playlist, the playlist could be
 * located at tunefind.com/movie/title-release_year or
 * at tunefind.com/movie/title therefore we should try both
 * @param  {[Object]}  selectedMovie
 * @return {Promise}  once resolved will contain an array of objects
 * which have artist & title properties
 */
const scrapeSoundtrackData = async selectedMovie => {
  const soundtrackURLWithYear = createSoundTracksPageURL(selectedMovie);
  const soundtrackURLWithoutYear = createSoundTracksPageURL(
    selectedMovie,
    false
  );
  try {
    let { data, response } = await scrapeIt(
      soundtrackURLWithYear,
      scrapingConfig
    );
    if (response.statusCode === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }

  try {
    let { data, response } = await scrapeIt(
      soundtrackURLWithoutYear,
      scrapingConfig
    );
    if (response.statusCode === 200) {
      return data;
    } else {
      throw new Error("404 - playlist not found");
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * Generates a URL to the tunefind playlist page
 * @param  {[type]}  movie
 * @param  {Boolean} [appendYear=true] append year to the URL or not
 * @return {[String]}
 */
const createSoundTracksPageURL = (movie, appendYear = true) => {
  let year = movie.release_date.split("-")[0];
  let formattedTitle = movie.title.replace(" ", "-");
  formattedTitle = appendYear ? `${formattedTitle}-${year}` : formattedTitle;
  return process.env.TUNEFIND_URL + formattedTitle;
};

module.exports = {
  scrapeSoundtrackData
};
