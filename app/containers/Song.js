import React, { Component } from 'react';
import { Link } from 'react-router';
import songObject from '../utils/songObject';
import Lyrics from '../components/Lyrics/Lyrics';

export default class HomePage extends Component {
  componentWillMount() {
    this.setState({ loading: true, error: false, isPlaying: false });
    songObject()
    .catch((e) => {
      this.setState({ error: true });
    })
    .then((e) => {
      const newState = Object.assign({}, {
        loading: false,
        beat: 0,
        error: false,
      },
      { ...e });
      this.setState(newState);
    });
  }
  componentDidUpdate() {
    setTimeout(this.play(), 5000);
  }
  play() {
    if (!this.state.isPlaying) {
      this.setState({ isPlaying: true });
      this.refs.video.currentTime = this.refs.audio.currentTime;
      this.refs.audio.play();
      this.refs.video.play();

      // const a = this.refs.audio;
      const timer = this.state.header.BPM / 8;
      let currentBeat = this.state.beat;
      setInterval(() => {
        this.setState({ beat: currentBeat });
        currentBeat++;
      }, timer);
    }
  }
  render() {
    if (this.state.loading) {
      return <h1>loading</h1>;
    } else if (this.state.error) {
      return <h1>error</h1>;
    }
    return (
      <div>
        <div styles={{ position: 'absolute' }}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <h1>{this.state.header.TITLE}</h1>
        <p>{this.state.beat}</p>
        <video
          src={this.state.header.FILES.video.uri}
          ref="video"
        />
        <audio
          src={this.state.header.FILES.audio.uri}
          ref="audio"
        />
        <Lyrics
          header={this.state.header}
          songArr={this.state.body.songArr}
          beat={this.state.beat}
        />
      </div>
    );
  }
}
