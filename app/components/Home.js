import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Karaoke.js</h2>
          <Link to="/counter">to Counter</Link>
          <br />
          <Link to="/song">to Song</Link>
          <br />
          <Link to="/songAudioContext">to songAudioContext</Link>
        </div>
      </div>
    );
  }
}
