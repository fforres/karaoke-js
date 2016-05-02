const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
const joinedText = (key) => {
  let text = '';
  key.forEach((el, i) => {
    if (i > 3) {
      text += el;
      if (el === '') {
        text += ' ';
      }
    }
  });
  return text;
};

const parser = (fileData) => new Promise((subResolve, subReject) => {
  const lines = fileData.split('\n');
  const ob = {
    header: {},
    body: {
      songArr: [],
      songSentences: []
    },
  };
  try {
    let newSentence = {
      text: '',
      startBeat: 0,
      endBeat: 0,
      syllabes: 0
    };
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
        // create array;
        const key = el.split(' ');
        const val = {
          text: joinedText(key),
          tempo: parseInt(key[1], 10),
          type: key[0],
          duration: parseInt(key[2], 10),
          tone: key[3],
        };
        ob.body.songArr[parseInt(key[1], 10)] = val;
      }
    });

    let previousSyllabe = 0;
    ob.body.songArr.forEach((el, i) => {
      // add new sentence.
      // Is the first syllabe?
      if (newSentence.syllabes === 0) {
        newSentence.startBeat = el.tempo;
      }
      if (el.text.indexOf('~') < 0) {
        newSentence.text += el.text;
      }
      newSentence.syllabes += 1;
      if (el.type === '-') {
        newSentence.endBeat = (ob.body.songArr[previousSyllabe].tempo +
          ob.body.songArr[previousSyllabe].duration);
        ob.body.songSentences[newSentence.startBeat] = newSentence;
        newSentence = {
          text: '',
          startBeat: 0,
          endBeat: 0,
          syllabes: 0
        };
      }
      previousSyllabe = i;
    });
  } catch (e) {
    subReject(e);
  }
  subResolve(ob);
});
export default parser;
