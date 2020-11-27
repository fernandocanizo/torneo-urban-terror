const rfr = require('rfr');
const express = require('express');

const verifyJwt = rfr('/app/lib/verifyJwt');
const player = rfr('/app/controllers/player');
const team = rfr('/app/controllers/team');


const router = express.Router();

router.use('*', verifyJwt);

// sin autenticación
// TODO: redireccionar a pagina con autenticación en caso de entrar autenticado a estás rutas
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Inicio' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', player.login);
router.post('/logout', player.logout);

router.get('/register', (req, res) => {
  res.render('register', { title: 'Registro' });
});

router.post('/register-player', player.register);

// con autenticación
router.get('/view-authenticated', (req, res) => {
  res.render('view-authenticated', {
    title: 'Usuario autenticado',
    player: req.playerData,
  });
});

router.get('/team/create', team.creationPage);
router.post('/team/create', team.create);


module.exports = router;
