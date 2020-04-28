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

  let newMovie = [...movies];


  if (genre && !['action', 'drama', 'comedy', 'animation', 'thriller', 'crime', 'romantic', 'spy', 'adventure', 'documentary', 'horror', 'history', 'western', 'biography', 'musical', 'fantasy', 'war', 'grotesque'].includes(genre.toLowerCase())) {
    return res.status(400).json({ error: 'needs to include valid genre' });
  }

  

  if (genre) {
    newMovie = newMovie.filter((movie) => movie.genre.includes(genre));
  }
  
  
  if (country && !['united states', 'italy', 'great britain', 'japan', 'france', 'germany', 'spain', 'canada', 'china', 'hungary', 'israel'].includes(country.toLowerCase())) {
    return res.status(400).json({ error: 'needs to include valid country' });
  }
  if (country) {
    newMovie = newMovie.filter((app) => app.country.includes(country));
  }

  if (Number(avg_vote) < 0 && Number(avg_vote) > 10){
    return res.status(400).json({ error: 'needs to include valid genre' });
  } 

  if (avg_vote) {
    newMovie = newMovie.filter(movie =>  Number(movie.avg_vote) >= Number(avg_vote));
  }


  res.json(newMovie);
});

app.listen(8080, () => console.log('Server on 8080'));
