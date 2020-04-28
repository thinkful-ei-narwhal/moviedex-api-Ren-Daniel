'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies.js');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('common'));
app.use(handleBearer);

const API_TOKEN = process.env.API_TOKEN;

function handleBearer(req, res, next) {
  const authValue = req.get('Authorization') || ' ';
  if (!authValue.toLowerCase().startsWith('bearer')) {
    return res.status(400).json({ error: 'Missing Bearer token' });
  }

  const authToken = authValue.split(' ')[1];
  if (authToken !== API_TOKEN) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  next();
}

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query;
  const newGenre = genre.toLowerCase();
  const newCountry = country.toLowerCase();
  let newMovies = [...movies];
  let genreArr = [];
  newMovies.forEach((movie) => {
    const movieString = movie.toLowerCase();
    if (!genreArr.includes(movieString)) {
      genreArr.push(movieString);
    }
  });
  let countryArr = [];
  movies.forEach((movie) => {
    const movieString = movie.country.toLowerCase();
    if (!countryArr.includes(movieString)) {
      countryArr.push(movieString);
    }
  });
  if (newGenre && !genreArr.includes(newGenre)) {
    return res.status(400).json({ error: '' });
  }
  if (newGenre) {
    newMovies = newMovies.filter((app) => app.genre.includes(newGenre));
  }
  if (newCountry && !countryArr.includes(newCountry)) {
    return res.status(400).json({ error: '' });
  }
  if (newCountry) {
    newMovies = newMovies.filter((app) => app.country.includes(newCountry));
  }
  res.json(newMovies);
});

app.listen(8080, () => console.log('Server on 8080'));
