const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
const joinedText = (key) => {
  let text = '';
  key.forEach((el, i) => {
    if (i > 3) {
      text += el;
    }
  });
  return text;
};

const parser = (fileData) => new Promise((subResolve, subReject) => {
  const lines = fileData.split('\n');
  const ob = {
    header: {},
    body: {
      songArr: []
    },
  };
  try {
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
  } catch (e) {
    subReject(e);
  }
  subResolve(ob);
});
export default parser;
