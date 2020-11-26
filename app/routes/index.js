const rfr = require('rfr');
const express = require('express');

const player = rfr('/app/controllers/player.js');


const router = express.Router();
const siteTitle = 'Torneo Urban Terror Latinoamericano';

router.get('/', function(req, res, next) {
  res.render('index', { title: siteTitle });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', player.login);
router.get('/register', (req, res) => {
  res.render('register', { title: siteTitle });
});

router.post('/register-player', player.register);


module.exports = router;
