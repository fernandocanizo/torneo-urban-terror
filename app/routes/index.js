const express = require('express');
const router = express.Router();


const siteTitle = 'Torneo Urban Terror Latinoamericano';

router.get('/', function(req, res, next) {
  res.render('index', { title: siteTitle });
});

router.get('/register', (req, res) => {
  res.render('register', { title: siteTitle });
});

router.post('/register-user', (req, res) => {
  console.log(req.body);
  res.send('No implementado');
});

module.exports = router;
