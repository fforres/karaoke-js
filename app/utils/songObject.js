// http://www.juliaandtania.com/blog/?p=14
const remote = require('electron').remote;
const fs = remote.require('fs');
const mp3Duration = remote.require('mp3-duration');
const Datauri = remote.require('datauri');

const start = () => new Promise((resolve, reject) => {
  const songs = ['test'];
  const song = songs[1];
  const songPath = `/Users/groupon/Github/fforres/karaoke-js/data/songs/${song}`;
  const songFile = song;
  const ob = {
    header: {
      PATHS: {},
      FILES: {},
    },
    body: {
      songArr: []
    }
  };
  const joinedText = (key) => {
    let text = '';
    key.forEach((el, i) => {
      if (i > 3) {
        text += el;
      }
    });
    return text;
  };
  const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
  const createSongPaths = (path, filename) => new Promise((subResolve) => {
    ob.header.PATHS = {
      txt: {
        full: `${path}/${filename}.txt`,
        filename: `${filename}.txt`
      },
      audio: {
        full: `${path}/${filename}.mp3`,
        filename: `${filename}.mp3`
      },
      video: {
        full: `${path}/${filename}.mp4`,
        filename: `${filename}.mp4`
      },
      background: {
        full: `${path}/${filename}.jpg`,
        filename: `${filename}.jpg`
      },
    };
    subResolve();
  });


  const createAudioFile = () => new Promise((subResolve, subReject) => {
    const datauri = new Datauri();
    datauri.on('encoded', (content) => {
      ob.header.FILES.audio = {
        uri: content
      };
      subResolve(true);
    });
    datauri.on('error', (err) => {
      subReject(err);
    });
    datauri.encode(ob.header.PATHS.audio.full);
  });


  const createVideoFile = () => new Promise((subResolve, subReject) => {
    const datauri = new Datauri();
    datauri.on('encoded', (content) => {
      ob.header.FILES.video = {
        uri: content
      };
      subResolve(true);
    });
    datauri.on('error', (err) => {
      subReject(err);
    });
    datauri.encode(ob.header.PATHS.video.full);
  });


  const createBackgroundFile = () => new Promise((subResolve, subReject) => {
    const datauri = new Datauri();
    datauri.on('encoded', (content) => {
      ob.header.FILES.background = {
        uri: content
      };
      subResolve(true);
    });
    datauri.on('error', (err) => {
      subReject(err);
    });
    datauri.encode(ob.header.PATHS.background.full);
  });


  const loadSongMetaData = () => new Promise((subResolve, subReject) => {
    fs.readFile(ob.header.PATHS.txt.full, 'utf8', (err, fileData) => {
      if (err) {
        subReject(err);
      }
      const lines = fileData.split('\n');
      lines.forEach((el) => {
        // Creating the Header;
        if (el[0] === '#') {
          const key = el.substring(1, el.indexOf(':'));
          let val = el.substring(el.indexOf(':') + 1, el.length);
          if (key === 'BPM') {
            val = val.replace(',', '.');
          }
          if (isNumber(val)) {
            if (key === 'BPM') {
              ob.header[key] = parseFloat(val);
            } else {
              ob.header[key] = parseInt(val, 10);
            }
          } else {
            ob.header[key] = val;
          }
          // Creating the BODY;
        } else if (el[0] === ':' || el[0] === '-' || el[0] === '*' || el[0] === 'F') {
          const key = el.split(' ');
          const val = {
            text: joinedText(key),
            tempo: key[1],
            type: key[0],
            duration: key[2],
            tone: key[3],
          };
          ob.body.songArr[key[1]] = val;
        }
      });
      subResolve(true);
    });
  });

  const loadSongData = () => new Promise((subResolve, subReject) => {
    mp3Duration(ob.header.PATHS.audio.full, (err, duration) => {
      if (err) {
        subReject(err);
      }
      ob.header.AUDIODURATION = duration * 1000;
      subResolve(true);
    });
  });
  createSongPaths(songPath, songFile)
    .then(() => createAudioFile())
    .then(() => createVideoFile())
    .then(() => createBackgroundFile())
    .then(() => loadSongMetaData())
    .then(() => loadSongData())
    .catch((e) => {
      reject(e);
    })
    .then(() => {
      resolve(ob);
    });
});


export default start;
