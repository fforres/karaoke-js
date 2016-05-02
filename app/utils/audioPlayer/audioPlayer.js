const audioPlayer = () => {
  const OB = {};

  OB.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  navigator.getMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
  OB.source = OB.audioCtx.createBufferSource();
  const gainMicrophoneNode = OB.audioCtx.createGain();
  const gainMusicNode = OB.audioCtx.createGain();
  OB.recorder = OB.audioCtx.createScriptProcessor(512, 1, 1);
  OB.recorder.onaudioprocess = (e) => {
    const inputBuffer = e.inputBuffer;
    const outputBuffer = e.outputBuffer;
    for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
      const inputData = inputBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);
      for (let sample = 0; sample < inputBuffer.length; sample++) {
        outputData[sample] = inputData[sample];
      }
    }
  };

  OB.connectSong = (arrayBuffer) => OB.audioCtx
    .decodeAudioData(arrayBuffer)
    .then((decodedData) => {
      gainMusicNode.gain.value = 0;
      OB.source.buffer = decodedData;
      OB.source.connect(gainMusicNode);
      gainMusicNode.connect(OB.audioCtx.destination);
    });

  OB.captureMicrophone = () => {
    navigator.getMedia(
      { audio: true },
      (stream) => {
        gainMicrophoneNode.gain.value = 0;
        const mediaStreamSource = OB.audioCtx.createMediaStreamSource(stream);
        mediaStreamSource.connect(OB.recorder);
        OB.recorder.connect(gainMicrophoneNode);
        gainMicrophoneNode.connect(OB.audioCtx.destination);
      },
      (err) => {
        console.error(err);
      }
    );
  };

  OB.start = () => {
    OB.source.start(0);
  };
  OB.pause = () => {
    console.info('pause');
    return OB.audioCtx.suspend();
  };
  OB.play = () => {
    console.info('play');
    return OB.audioCtx.resume();
  };
  OB.stop = () => {
    console.info('stop');
    return OB.audioCtx.close();
  };

  OB.turnMicrophoneVolumeUp = () => {
    gainMicrophoneNode.gain.value = gainMicrophoneNode.gain.value + 0.1;
    console.info('Turning microfone volume up: ', gainMicrophoneNode.gain.value);
  };
  OB.turnMicrophoneVolumeDown = () => {
    gainMicrophoneNode.gain.value = gainMicrophoneNode.gain.value - 0.1;
    if (gainMusicNode.gain.value < 0.1) {
      gainMusicNode.gain.value = 0;
    }
    console.info('Turning microfone volume down: ', gainMicrophoneNode.gain.value);
  };

  OB.turnMusicVolumeUp = () => {
    gainMusicNode.gain.value = gainMusicNode.gain.value + 0.1;
    console.info('Turning volume up: ', gainMusicNode.gain.value);
  };
  OB.turnMusicVolumeDown = () => {
    gainMusicNode.gain.value = gainMusicNode.gain.value - 0.1;
    if (gainMusicNode.gain.value < 0.1) {
      gainMusicNode.gain.value = 0;
    }
    console.info('Turning volume down: ', gainMusicNode.gain.value);
  };
  return OB;
};

export default audioPlayer();
