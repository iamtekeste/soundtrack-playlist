const {getSoundTracks, createSoundTracksPageURL} = require('./SoundTrackService');

const soundtrackURL = createSoundTracksPageURL('Pulp Fiction');
getSoundTracks(soundtrackURL).then(data => {
  console.log(data);
}).catch(err => {
  console.log(err);
});
