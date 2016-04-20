/* eslint no-console: 0 */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import fs from 'fs';
import path from 'path';

import config from './webpack.config.development';

const app = express();
const compiler = webpack(config);
const PORT = 3000;

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler));

app.listen(PORT, 'localhost', err => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Listening at http://localhost:${PORT}`);
});


app.get('/song', (req, res) => {
  const stream = fs.createReadStream('./data/songs/test/test.mp3');
  stream.on('data', (data) => {
    res.write(data);
  });
  stream.on('end', () => {
    res.end();
  });
});

app.get('/videofile', (req, res) => {
  res.sendFile('test.mp4', { root: './data/songs/test' });
});

app.get('/data', (req, res) => {
  res.sendFile('test.txt', { root: './data/songs/test' });
});
