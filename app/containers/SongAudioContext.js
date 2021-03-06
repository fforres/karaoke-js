
import React, { Component } from 'react';
import { Link } from 'react-router';
import parseSonfFile from '../utils/parseSongFile';
import Lyrics from '../components/Lyrics/Lyrics';
import audioPlayer from '../utils/audioPlayer/audioPlayer';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: {},
      body: {
        songArr: []
      },
      beat: 0,
      isPlaying: false
    };
    this.play = this.play.bind(this);
  }

  componentWillMount() {
    this.setState({ loading: true, error: false, isPlaying: false });
  }
  componentDidMount() {
    const canv = this.refs.canvas;
    const ctx = this.refs.canvas.getContext('2d');
    audioPlayer.captureMicrophone();
    this.refs.video.addEventListener('play', function playEventListener() {
      const _this = this;
      (function loop() {
        if (!_this.paused && !_this.ended) {
          ctx.drawImage(_this, 0, 0, canv.width, canv.height - 3);
          setTimeout(loop, 1000 / 60); // drawing at 30fps
        }
      })();
    }, 0);
    fetch('http://localhost:3000/song')
      .then((res) => res.arrayBuffer())
      .then((r) => audioPlayer.connectSong(r))
      /*
        This reads the song file from the server
        decodes it, parses it, and returns the data
        TODO: Change it into a different file
      */
      .then(() => fetch('http://localhost:3000/data'))
      .then((res) => res.body.getReader().read())
      .then((result) => {
        const a = new TextDecoder().decode(result.value, { stream: true });
        return parseSonfFile(a);
      })
      .then((parsedFile) => {
        this.setState({ ...parsedFile });
        this.play();
      });
  }
  componentWillUnmount() {
    audioCtx = null;
  }
  play() {
    if (!this.state.isPlaying) {
      this.setState({ isPlaying: true });
      audioPlayer.start();
      this.refs.video.play();
      // const a = this.refs.audio;
      const timer = this.state.header.BPM / 8;
      let currentBeat = this.state.beat;
      setTimeout(() => {
        setInterval(() => {
          this.setState({ beat: currentBeat });
          currentBeat++;
        }, timer);
      }, 20178);
    }
  }
  render() {
    return (
      <div>
        <div styles={{ position: 'absolute' }}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <video
          src="http://localhost:3000/videofile"
          ref="video"
          style={{ display: 'none' }}
        />
        <canvas ref="canvas"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: -1,
          }}
        ></canvas>
        <h1>{this.state.beat}</h1>
        <Lyrics
          header={this.state.header}
          songArr={this.state.body.songArr}
          beat={this.state.beat}
        />
      </div>
    );
  }
}
