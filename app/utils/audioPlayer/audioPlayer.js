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
  const gainNode = OB.audioCtx.createGain();
  gainNode.gain.value = 0.1;
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
      OB.source.buffer = decodedData;
      OB.source.connect(OB.audioCtx.destination);
    });

  OB.captureMicrophone = () => {
    navigator.getMedia(
      { audio: true },
      (stream) => {
        const mediaStreamSource = OB.audioCtx.createMediaStreamSource(stream);
        mediaStreamSource.connect(OB.recorder);
        OB.recorder.connect(gainNode);
        gainNode.connect(OB.audioCtx.destination);
      },
      (err) => {
        console.error(err);
      }
    );
  };

  OB.start = () => {
    OB.source.start(0);
  };

  OB.pause = () => OB.audioCtx.suspend();
  OB.play = () => OB.audioCtx.resume();

  OB.turnVolumeUp = () => {
    gainNode.gain.value = gainNode.gain.value + 0.1;
  };
  OB.turnVolumeDown = () => {
    gainNode.gain.value = gainNode.gain.value - 0.1;
  };
  return OB;
};

export default audioPlayer();
