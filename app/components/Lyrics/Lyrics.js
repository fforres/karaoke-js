import React, { Component } from 'react';
// import { Link } from 'react-router';
// import styles from './Lyrics.css';

export default class Home extends Component {
  render() {
    let Lyric = '';
    if (this.props.songSentences[this.props.beat]) {
      Lyric += ' ' + this.props.songSentences[this.props.beat].text
    }
    return (
      <div>
        <h1>{Lyric}</h1>
      </div>
    );
  }
}
