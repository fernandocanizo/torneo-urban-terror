const rfr = require('rfr');
const express = require('express');

const verifyJwt = rfr('/app/lib/verifyJwt');
const player = rfr('/app/controllers/player');
const team = rfr('/app/controllers/team');
const main = rfr('/app/controllers/main');


const router = express.Router();

// We require authentication for every route, then `verifyJwt`
// takes care of exceptions
router.use('*', verifyJwt);

router.get('/', main.home);
router.get('/rules', main.rules);
router.get('/register', main.register);
router.get('/login', main.login);
router.get('/logout', player.logout);

router.post('/register', player.register);
router.post('/login', player.login);

router.get('/team/create', team.creationPage);
router.post('/team/create', team.create);


module.exports = router;
