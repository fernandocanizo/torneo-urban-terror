const home = (req, res) => {
  return res.render('index', {
    title: 'Inicio',
    player: req.playerData,
  });
};

const rules = (req, res) => {
  return res.render('rules', {
    title: 'Reglas',
    player: req.playerData,
  });
};

const register = (req, res) => {
  return res.render('register', {
    title: 'Registro',
    player: req.playerData,
  });
};

const login = (req, res) => {
  return res.render('login', { title: 'Login' });
};


module.exports = {
  home,
  rules,
  register,
  login,
};
