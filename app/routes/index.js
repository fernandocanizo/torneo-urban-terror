const rfr = require('rfr');
const express = require('express');

const verifyJwt = rfr('/app/lib/verifyJwt');
const player = rfr('/app/controllers/player');


const router = express.Router();
const siteTitle = 'Torneo Urban Terror Latinoamericano';

router.use('*', verifyJwt);

// sin autenticación
// TODO: redireccionar a pagina con autenticación en caso de entrar autenticado a estás rutas
router.get('/', function(req, res, next) {
  res.render('index', { title: siteTitle });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', player.login);
router.post('/logout', player.logout);

router.get('/register', (req, res) => {
  res.render('register', { title: siteTitle });
});

router.post('/register-player', player.register);

// con autenticación
router.get('/view-authenticated', (req, res) => {
  res.render('view-authenticated', { title: 'Vista protegida', player: req.playerData });
});

module.exports = router;
