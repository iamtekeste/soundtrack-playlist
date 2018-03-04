const scrapeIt = require('scrape-it');

const createSoundTracksPageURL = (title) => {
  const formattedTitle = title.replace(' ', '-');
  return `https://www.tunefind.com/movie/${formattedTitle}`
};
const getSoundTracks = (soundtrackURL) => {
  return scrapeIt(soundtrackURL, {
    soundtracks: {
      listItem: 'div[class^=SongRow__container]',
      data: {
        title:{
          selector: 'a[title]',
          attr: 'title'
        },
        artist: '.Tunefind__Artist',
      }
    }
  }).then(({ data, response }) => {
      if(response.statusCode === 200)
        return data;
  }).catch(err => {
    return err;
  });
};

exports.getSoundTracks = getSoundTracks;
exports.createSoundTracksPageURL = createSoundTracksPageURL;
